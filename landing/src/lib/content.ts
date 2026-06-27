/**
 * Features data exported from the landing page.
 * Using extracted data so we can unit test each feature independently
 * and verify the features remain consistent when we update the page.
 */

export const features = [
  {
    title: 'Smart Rent Splitting',
    description:
      'Split rent fairly regardless of room sizes. Supports equal splits, proportional splits, and custom allocations. Automatic reminders when payments are due.',
    icon: 'currency-dollar',
    color: 'indigo',
  },
  {
    title: 'Expense Tracking',
    description:
      'Log shared purchases, categorize expenses, and track who owes what. Settle up with one tap or keep running tabs over time. Export reports for tax season.',
    icon: 'list-bullet',
    color: 'green',
  },
  {
    title: 'Chore Management',
    description:
      'Create rotating chore schedules, assign tasks to roommates, and track completion. Set recurring tasks and get notified when chores are due.',
    icon: 'check-circle',
    color: 'amber',
  },
  {
    title: 'Household Chat',
    description:
      'Dedicated chat channels for your household. Discuss plans, share updates, and keep all household communication in one place — no more group chat chaos.',
    icon: 'chat-bubble-left-right',
    color: 'purple',
  },
  {
    title: 'Calendar & Reminders',
    description:
      'Shared household calendar for move-in dates, lease renewals, and maintenance schedules. Smart reminders for rent, bills, and upcoming due dates.',
    icon: 'calendar',
    color: 'rose',
  },
  {
    title: 'Spending Insights',
    description:
      'Visual dashboards showing spending patterns, upcoming obligations, and household budget health. Know exactly where your money goes each month.',
    icon: 'chart-bar',
    color: 'cyan',
  },
] as const

export const steps = [
  {
    number: 1,
    title: 'Create Your Household',
    description:
      'Sign up, create your household profile, and invite your roommates with a simple link or email.',
  },
  {
    number: 2,
    title: 'Set Up Your Finances',
    description:
      'Add your rent, utilities, and any shared expenses. Roomies automatically calculates each person\'s share.',
  },
  {
    number: 3,
    title: 'Live Your Best Life',
    description:
      'Track expenses, manage chores, and communicate — all automatically. Focus on being roommates, not accountants.',
  },
] as const

export const faqs = [
  {
    question: 'Is Roomies really free?',
    answer:
      'Yes! Roomies is free for households of up to 4 people. Our premium plan unlocks unlimited roommates, advanced analytics, and integrations with banking apps.',
  },
  {
    question: 'How does rent splitting work?',
    answer:
      'You can split rent equally among all roommates, or proportionally based on room size. Roomies tracks each person\'s share and sends automatic payment reminders.',
  },
  {
    question: 'What platforms is Roomies available on?',
    answer:
      'Roomies is available as a web app, iOS app, and Android app. All platforms sync in real-time so everyone stays up to date.',
  },
  {
    question: 'Is my financial data secure?',
    answer:
      'Absolutely. We use bank-level encryption and never store your banking credentials. All financial data is encrypted at rest and in transit.',
  },
] as const
