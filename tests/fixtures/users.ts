export type RegistrationUser = {
  title: 'Mr' | 'Mrs';
  name: string;
  email: string;
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
};

export function createRegistrationUser(testName: string): RegistrationUser {
  const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
  const safeName = testName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return {
    title: 'Mr',
    name: `Auto User ${uniqueId}`,
    email: `automation-${safeName}-${uniqueId}@example.com`,
    password: `AutoPass-${uniqueId}!`,
    day: '15',
    month: 'June',
    year: '1996',
    firstName: 'Auto',
    lastName: `User${uniqueId.slice(-4)}`,
    company: 'Bug0 QA',
    address1: '221B Baker Street',
    address2: 'Suite 5',
    country: 'India',
    state: 'Karnataka',
    city: 'Bengaluru',
    zipcode: '560001',
    mobileNumber: `98765${uniqueId.replace(/\D/g, '').slice(-5).padStart(5, '0')}`,
  };
}
