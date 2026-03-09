import UIKit
import Capacitor
import AuthenticationServices

@objc(AppleSignInPlugin)
public class AppleSignInPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "AppleSignInPlugin"
    public let jsName = "AppleSignIn"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "authorize", returnType: CAPPluginReturnPromise)
    ]

    private var currentCall: CAPPluginCall?
    private var authController: ASAuthorizationController?

    @objc func authorize(_ call: CAPPluginCall) {
        self.bridge?.saveCall(call)
        self.currentCall = call

        let provider = ASAuthorizationAppleIDProvider()
        let request = provider.createRequest()
        request.requestedScopes = [.fullName, .email]
        if let nonce = call.getString("nonce") {
            request.nonce = nonce
        }

        let controller = ASAuthorizationController(authorizationRequests: [request])
        controller.delegate = self
        controller.presentationContextProvider = self
        self.authController = controller

        DispatchQueue.main.async {
            controller.performRequests()
        }
    }

    private func finishCall() {
        if let id = currentCall?.callbackId {
            bridge?.releaseCall(withID: id)
        }
        currentCall = nil
        authController = nil
    }
}

extension AppleSignInPlugin: ASAuthorizationControllerDelegate {
    public func authorizationController(controller: ASAuthorizationController,
                                        didCompleteWithAuthorization authorization: ASAuthorization) {
        guard let credential = authorization.credential as? ASAuthorizationAppleIDCredential else {
            currentCall?.reject("Credential invalide")
            finishCall()
            return
        }
        var result: [String: Any] = ["user": credential.user]
        if let email = credential.email { result["email"] = email }
        if let name = credential.fullName?.givenName { result["givenName"] = name }
        if let name = credential.fullName?.familyName { result["familyName"] = name }
        if let data = credential.identityToken, let str = String(data: data, encoding: .utf8) {
            result["identityToken"] = str
        }
        if let data = credential.authorizationCode, let str = String(data: data, encoding: .utf8) {
            result["authorizationCode"] = str
        }
        currentCall?.resolve(["response": result])
        finishCall()
    }

    public func authorizationController(controller: ASAuthorizationController,
                                        didCompleteWithError error: Error) {
        let code = (error as NSError).code
        currentCall?.reject(error.localizedDescription, "\(code)")
        finishCall()
    }
}

extension AppleSignInPlugin: ASAuthorizationControllerPresentationContextProviding {
    public func presentationAnchor(for controller: ASAuthorizationController) -> ASPresentationAnchor {
        return self.bridge?.viewController?.view.window ?? UIWindow()
    }
}
