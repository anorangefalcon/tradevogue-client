// user.model.ts
export class User {
    username: string = '';
  password: string = '';
  email: string = '';
  // Add other user-related properties here
    constructor() {
    this.username = '';
    this.password = '';
    this.email = '';
    // Initialize other properties here if needed
  }
}