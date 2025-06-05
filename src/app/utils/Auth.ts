export function checkEmail(email: string): string {
  if (!email) {
    return 'Email cannot be empty.';
  }

  var regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!regex.test(email)) {
    return 'Invalid email format.';
  }

  return '';
}

export function checkPassword(password: string, isRegistering = false): string {
  if (!password) {
    return 'Password cannot be empty.';
  }

  // the cehck below are done only if the user is registering
  if (!isRegistering) {
    return '';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  var regex = /^(.*[0-9].*)$/;
  if (!regex.test(password)) {
    return 'Password must contain at least one number.';
  }

  var regex = /^(.*[-!@#$%_^&*].*)$/;
  if (!regex.test(password)) {
    return 'Password must contain at least one special character.';
  }

  return '';
}
