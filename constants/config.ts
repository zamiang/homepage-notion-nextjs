import { addDays, subDays } from 'date-fns';

// NOTE: Update in webpack.config.js
const scopes = [
  'https://www.googleapis.com/auth/calendar.events.readonly',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
];

const NUMBER_OF_DAYS_BACK = 30;
const NUMBER_OF_DAYS_FORWARD = 14;

export default {
  REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/dashboard',
  DARK_MODE: 'DARK_MODE',
  GOOGLE_SCOPES: scopes,
  IS_ONBOARDING_COMPLETED: 'IS_ONBOARDING_COMPLETED_V2',
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  SHOULD_FILTER_OUT_NOT_ATTENDING_EVENTS: true,
  NUMBER_OF_DAYS_BACK,
  WEEK_STARTS_ON: 0,
  MEETING_PREP_NOTIFICATION_EARLY_MINUTES: 10,
  ATTENDEE_MAX: 10, // for 'show more'
  ICON_SIZE: 20,
  IS_GMAIL_ENABLED: false,
  GOOGLE_CALENDAR_FILTER: ['declined'], // Could be ['needsAction', 'declined']
  MAX_MEETING_ATTENDEE_TO_COUNT_AN_INTERACTION: 10,
  startDate: subDays(new Date(), NUMBER_OF_DAYS_BACK),
  endDate: addDays(new Date(), NUMBER_OF_DAYS_FORWARD),
  NOTIFICATIONS_KEY: 'KELP_NOTIFICATION_SETTING',
  LAST_NOTIFICATION_KEY: 'KELP_LAST_NOTIFICATION_ID',
  LAST_UPDATED: 'KELP_LAST_UPDATED',
  LAST_UPDATED_USER_ID: 'KELP_LAST_UPDATED_USER_ID',
  INTERNAL_WEBSITE_ID: '<test>',
  ALLOWED_DOMAINS: [
    'docs.google.com',
    'slides.google.com',
    'sheets.google.com',
    'figma.com',
    'notion.so',
    'miro.com',
    'github.com',
    'jira.com',
    'loom.com',
    'basecamp.com',
    'microsoft.com', // not sure about them
    'miro.com',
    'basecamp.com',
    'dribbble.com',
    'amplitude.com',
    'gitlab.com',
    'evernote.com',
    'linkedin.com',
    'trello.com',
    'invisionapp.com',
    'roamresearch.com',
    'obsidian.md',
    'clickup.com',
    'asana.com',
    'hypercontext.com',
    'soapboxhq.com',
    'almanac.io',
  ],
  BLOCKED_DOMAINS: [
    'onkkkcfnlbkoialleldfbgodakajfpnl', // extension url
    'mail.google.com',
    'www.google.com',
    'calendar.google.com',
    'chrome://',
    'meet.google.com',
    'outlook.office365.com',
    'file:///',
    'twitter.com/home',
  ],
};
