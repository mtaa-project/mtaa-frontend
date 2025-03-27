export class AuthErrorException extends Error {
  name = "AuthError"

  constructor(message: string) {
    super(message)

    Object.setPrototypeOf(this, AuthErrorException.prototype)
  }
}
