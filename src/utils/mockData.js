export const MONTHS = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
];

export const MEMBER_TYPES = ['Lid', 'Senior', 'Bestuur'];
export const CIVIL_STATUS = ['Single', 'Married'];
export const PAYMENT_METHODS = ['Bank Transfer', 'Cash', 'iDEAL', 'Other'];
export const CONTRIBUTION_RATES = { Single: 10, Married: 20 };

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockMembers = [
  {
    id: 'mem001', lidnummer: 'AG-001', voornamen: 'Ahmad', tussenvoegsel: '', achternaam: 'Al-Farsi',
    membertype: 'Bestuur', burgerlijke_staat: 'Married', contributietarief: 20,
    betaal_methode: 'Bank Transfer', adres: 'Keizersgracht 12', postcode: '1015 CJ',
    woonplaats: 'Amsterdam', geboortedatum: '1978-04-15', geboorteplaats: 'Cairo',
    email: 'ahmad.alfarsi@email.com', telefoonnummer: '+31612345678',
    registratie_datum: '2019-01-10', status: 'Active'
  },
  {
    id: 'mem002', lidnummer: 'AG-002', voornamen: 'Fatimah', tussenvoegsel: '', achternaam: 'Benali',
    membertype: 'Lid', burgerlijke_staat: 'Married', contributietarief: 20,
    betaal_methode: 'iDEAL', adres: 'Prinsengracht 44', postcode: '1016 GZ',
    woonplaats: 'Amsterdam', geboortedatum: '1985-09-22', geboorteplaats: 'Rabat',
    email: 'fatimah.benali@email.com', telefoonnummer: '+31623456789',
    registratie_datum: '2019-03-15', status: 'Active'
  },
  {
    id: 'mem003', lidnummer: 'AG-003', voornamen: 'Yusuf', tussenvoegsel: 'van den', achternaam: 'Berg',
    membertype: 'Lid', burgerlijke_staat: 'Single', contributietarief: 10,
    betaal_methode: 'Bank Transfer', adres: 'Jordaan 7', postcode: '1016 AB',
    woonplaats: 'Amsterdam', geboortedatum: '1994-12-03', geboorteplaats: 'Amsterdam',
    email: 'yusuf.berg@email.com', telefoonnummer: '+31634567890',
    registratie_datum: '2020-06-01', status: 'Active'
  },
  {
    id: 'mem004', lidnummer: 'AG-004', voornamen: 'Maryam', tussenvoegsel: '', achternaam: 'Hassan',
    membertype: 'Senior', burgerlijke_staat: 'Married', contributietarief: 20,
    betaal_methode: 'Cash', adres: 'Vondelstraat 89', postcode: '1054 GJ',
    woonplaats: 'Amsterdam', geboortedatum: '1955-07-18', geboorteplaats: 'Baghdad',
    email: 'maryam.hassan@email.com', telefoonnummer: '+31645678901',
    registratie_datum: '2018-11-20', status: 'Active'
  },
  {
    id: 'mem005', lidnummer: 'AG-005', voornamen: 'Ibrahim', tussenvoegsel: '', achternaam: 'Osman',
    membertype: 'Lid', burgerlijke_staat: 'Single', contributietarief: 10,
    betaal_methode: 'Bank Transfer', adres: 'De Pijp 33', postcode: '1073 BP',
    woonplaats: 'Amsterdam', geboortedatum: '1999-02-14', geboorteplaats: 'Mogadishu',
    email: 'ibrahim.osman@email.com', telefoonnummer: '+31656789012',
    registratie_datum: '2022-01-08', status: 'Active'
  },
  {
    id: 'mem006', lidnummer: 'AG-006', voornamen: 'Khadijah', tussenvoegsel: '', achternaam: 'Rizqi',
    membertype: 'Lid', burgerlijke_staat: 'Married', contributietarief: 20,
    betaal_methode: 'iDEAL', adres: 'Overtoom 120', postcode: '1054 HT',
    woonplaats: 'Amsterdam', geboortedatum: '1988-05-30', geboorteplaats: 'Jakarta',
    email: 'khadijah.rizqi@email.com', telefoonnummer: '+31667890123',
    registratie_datum: '2021-09-12', status: 'Active'
  },
  {
    id: 'mem007', lidnummer: 'AG-007', voornamen: 'Omar', tussenvoegsel: '', achternaam: 'Diallo',
    membertype: 'Lid', burgerlijke_staat: 'Married', contributietarief: 20,
    betaal_methode: 'Bank Transfer', adres: 'Bijlmermeer 5', postcode: '1103 AE',
    woonplaats: 'Amsterdam', geboortedatum: '1980-11-25', geboorteplaats: 'Dakar',
    email: 'omar.diallo@email.com', telefoonnummer: '+31678901234',
    registratie_datum: '2020-02-28', status: 'Inactive'
  },
  {
    id: 'mem008', lidnummer: 'AG-008', voornamen: 'Aisha', tussenvoegsel: '', achternaam: 'Mahmoud',
    membertype: 'Bestuur', burgerlijke_staat: 'Single', contributietarief: 10,
    betaal_methode: 'Bank Transfer', adres: 'Plantage Muidergracht 20', postcode: '1018 TV',
    woonplaats: 'Amsterdam', geboortedatum: '1990-08-07', geboorteplaats: 'Alexandria',
    email: 'aisha.mahmoud@email.com', telefoonnummer: '+31689012345',
    registratie_datum: '2019-07-22', status: 'Active'
  },
  {
    id: 'mem009', lidnummer: 'AG-009', voornamen: 'Tariq', tussenvoegsel: '', achternaam: 'Nasser',
    membertype: 'Senior', burgerlijke_staat: 'Married', contributietarief: 20,
    betaal_methode: 'Cash', adres: 'Oud-Zuid 55', postcode: '1071 XC',
    woonplaats: 'Amsterdam', geboortedatum: '1950-03-11', geboorteplaats: 'Tunis',
    email: 'tariq.nasser@email.com', telefoonnummer: '+31690123456',
    registratie_datum: '2017-05-15', status: 'Active'
  },
  {
    id: 'mem010', lidnummer: 'AG-010', voornamen: 'Zainab', tussenvoegsel: '', achternaam: 'Idris',
    membertype: 'Lid', burgerlijke_staat: 'Single', contributietarief: 10,
    betaal_methode: 'iDEAL', adres: 'Noord 78', postcode: '1031 KA',
    woonplaats: 'Amsterdam', geboortedatum: '1997-06-19', geboorteplaats: 'Khartoum',
    email: 'zainab.idris@email.com', telefoonnummer: '+31601234567',
    registratie_datum: '2023-03-01', status: 'Active'
  },
  {
    id: 'mem011', lidnummer: 'AG-011', voornamen: 'Hamza', tussenvoegsel: '', achternaam: 'El Khatib',
    membertype: 'Lid', burgerlijke_staat: 'Married', contributietarief: 20,
    betaal_methode: 'Bank Transfer', adres: 'Westerpark 14', postcode: '1013 AN',
    woonplaats: 'Amsterdam', geboortedatum: '1983-10-08', geboorteplaats: 'Beirut',
    email: 'hamza.elkhatib@email.com', telefoonnummer: '+31612233445',
    registratie_datum: '2021-11-30', status: 'Active'
  },
  {
    id: 'mem012', lidnummer: 'AG-012', voornamen: 'Nadia', tussenvoegsel: '', achternaam: 'Boussaid',
    membertype: 'Lid', burgerlijke_staat: 'Single', contributietarief: 10,
    betaal_methode: 'iDEAL', adres: 'Slotervaart 9', postcode: '1067 BD',
    woonplaats: 'Amsterdam', geboortedatum: '2001-01-27', geboorteplaats: 'Amsterdam',
    email: 'nadia.boussaid@email.com', telefoonnummer: '+31623344556',
    registratie_datum: '2023-07-15', status: 'Active'
  },
];

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

// Generate payment records for last 6 months for active members
export function generateMockPayments(members) {
  const payments = [];
  const statuses = ['Paid', 'Unpaid', 'Partial', 'Paid', 'Paid', 'Unpaid'];

  members.filter(m => m.status === 'Active').forEach(member => {
    for (let i = 0; i < 6; i++) {
      let month = currentMonth - i;
      let year = currentYear;
      if (month <= 0) { month += 12; year -= 1; }

      const statusIndex = Math.floor(Math.random() * statuses.length);
      const status = i === 0
        ? (Math.random() > 0.4 ? 'Paid' : Math.random() > 0.5 ? 'Unpaid' : 'Partial')
        : statuses[statusIndex];

      const amountDue = member.contributietarief;
      let amountPaid = 0;
      let paymentDate = null;

      if (status === 'Paid') {
        amountPaid = amountDue;
        const d = new Date(year, month - 1, Math.floor(Math.random() * 20) + 1);
        paymentDate = d.toISOString().split('T')[0];
      } else if (status === 'Partial') {
        amountPaid = amountDue / 2;
        const d = new Date(year, month - 1, Math.floor(Math.random() * 20) + 1);
        paymentDate = d.toISOString().split('T')[0];
      }

      payments.push({
        id: generateId(),
        member_id: member.id,
        month,
        year,
        amount_due: amountDue,
        amount_paid: amountPaid,
        payment_date: paymentDate,
        payment_method: amountPaid > 0 ? member.betaal_methode : '',
        reference_note: amountPaid > 0 ? `REF-${member.lidnummer}-${year}${String(month).padStart(2,'0')}` : '',
        status,
      });
    }
  });

  return payments;
}
