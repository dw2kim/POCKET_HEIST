# Spec for Authentication Forms

## Functional requirements
- The `/login` page contains a login form with email, password fields, and a "Log In" submit button
- The `/signup` page contains a signup form with email, password fields, and a "Sign Up" submit button
- Each password field has a toggle icon to show or hide the password text
- On submit, the form logs the submitted email and password values to the browser console (no real auth yet)
- Each form includes a link to switch to the other form (e.g. "Don't have an account? Sign up" on login, and "Already have an account? Log in" on signup)
- The link between forms navigates to the respective route (`/login` ↔ `/signup`)

## Figma design reference (only if referenced)
- File: N/A
- Component name: N/A
- Key visual constraints: N/A

## Possible edge cases
- User submits the form with empty fields — form should not log and should indicate fields are required
- Password toggle should not reset or clear the field value when toggled
- Switching between forms should not carry over any field state

## Acceptance criteria
- Visiting `/login` renders a form with email input, password input (with show/hide toggle), and a "Log In" button
- Visiting `/signup` renders a form with email input, password input (with show/hide toggle), and a "Sign Up" button
- Clicking the password toggle switches the input type between `password` and `text`
- Submitting either form logs `{ email, password }` to the console
- Each page has a clearly visible link to navigate to the other auth form
- Both forms prevent submission when fields are empty

## Open questions
- Should the two forms share a single reusable `AuthForm` component, or be kept as separate implementations? Maybe. Use the best practice
- Should there be any client-side format validation on the email field (e.g. must contain `@`)? yes

## Testing Guidelines
Create a test file in ./tests folder for the new feature, and create meaningful tests for the following cases without going too heavy:
- Login form renders email input, password input, and submit button
- Signup form renders email input, password input, and submit button
- Password toggle changes input type from `password` to `text` and back
- Submitting the login form calls `console.log` with the entered credentials
- Navigation link from login points to `/signup` and vice versa
