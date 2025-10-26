// A small pool of names for random employee generation
export const FIRST_NAMES = ['Ella-Rose', 'Ben', 'Charlie', 'Diana', 'Elliot', 'Mike'];

export const LAST_NAMES = ["O'Connor", 'Johnson', 'Smith', 'Brown', 'Walker', 'Moore'];

// Helper: pick a random item from an array
export const pick = (array: string[]) => array[Math.floor(Math.random() * array.length)];

//  email builder for employee creation
export const buildEmail = (firstName: string, lastName: string): string => {
  // Strip apostrophes if encountered
  const cleanFirst = firstName.toLowerCase().split("'").join('');
  const cleanLast = lastName.toLowerCase().split("'").join('');

  return `${cleanFirst}.${cleanLast}@example.com`;
};
