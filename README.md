# Kelp: Your information filtration system

Kelp brings your data together in one place. Pivot your meetings by what documents the attendees have edited recently. By associating person, a time slot and documents together, Kelp infers associations between information, making the information easier to find. Prepare for your next meeting in a flash!

- https://chrome.google.com/webstore/devconsole/54522bcf-fc90-4948-a383-4e65c5514ba3/onkkkcfnlbkoialleldfbgodakajfpnl/edit?hl=en
- https://dashboard.render.com/web/srv-bv8ngnrlc6ck61fvgl8g

This aspires to do a few things with instant value:

- help you find what you need when you need it
- provide the ‘right information at the right time’
- be easy to understand (no 'black box' recommendation)

In the future it will also do things that are more 'vitamin' like

- Stay accountable to what you want to be doing
- Help separate from work
- Show information about relationships over time

## Open Source

I want this to be open source and free but with paid services on top. Simply put, a free version you can run in your browser that maintains no 'state' and a paid version that has secure database and is easily accessible across devices.

## Getting started

First create a [Google Oauth] app and enable the APIs you want to use. Currently, those are

- [Google Drive API]
- [GMail API]
- [Google Calendar API]

Then proceed with your node setup steps. Ensure you are using node 14 or greater

    npm install

Generate a signingKey

    npx node-jose-tools newkey -s 256 -t oct -a HS512

Generate an encryptionKey

    npx node-jose-tools newkey -s 256 -t oct -a A256GCM

Add these keys and your your google oauth app tokens to [.env.local]

    NEXT_PUBLIC_GOOGLE_CLIENT_ID=foo-bar-baz.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=foo
    JWT_SECRET=foo-bar-change-me
    JWT_SIGNING_KEY=signingKeyHere
    JWT_ENCRYPTION_KEY=encryptionKeyHere
    DATABASE_URL=postgresql://{whoami}@localhost/kelp

When starting the app in development mode

    npm run dev

[google oauth]: https://developers.google.com/identity/protocols/oauth2
[google drive api]: https://developers.google.com/drive
[gmail api]: https://developers.google.com/gmail/api
[google calendar api]: https://developers.google.com/calendar
[.env.local]: https://nextjs.org/docs/basic-features/environment-variables
