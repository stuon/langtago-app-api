export function validateText(name, value, min, max) {
  if (!value) return;

  if (min && value.length < min)
    throw `Please enter a ${name} greater than ${min} characters`;

  if (max && value.length > max)
    throw `Please enter a ${name} less than ${max} characters`;
}

export function validateFile(name, value, max) {
  if (!value) return;

  if (value.size > max)
    throw `Please upload a ${name} smaller than ${max / 1000000} MB.`;
}
