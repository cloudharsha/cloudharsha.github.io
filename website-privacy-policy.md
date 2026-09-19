---
title: Website Privacy Policy
permalink: /website-privacy-policy/
---

# Website Privacy Policy — Get Your Cert

_Last updated: 19 September 2026_

This policy covers the **Get Your Cert website** at
[get-your-cert.web.app](https://get-your-cert.web.app). The Android app has its own policy at
[/privacy-policy/](/privacy-policy/).

## Summary

You can use the whole website without an account, and if you do, nothing about you is stored on
any server. Signing in with Google is optional and exists only to sync your practice progress
across devices. There is no analytics, tracking or advertising, with or without an account.

## Without signing in

Your practice-test and game results (which tests you have taken, your scores, and when) are saved
**only in your browser**, using its local storage. They are not sent to us or to anyone else, and
they are removed when you clear this site's data in your browser.

## If you sign in with Google

Signing in uses **Firebase Authentication**, a Google service. It stores:

- your Google account's name, email address and profile photo address,
- a user ID that Firebase creates for you,
- when your account was created and when you last signed in.

Your progress is then also copied to **Cloud Firestore**, a Google database, stored in Google
Cloud's Mumbai region (`asia-south1`). For each test or game level, it stores your score, the
number of questions, and the date you finished it. Nothing else is stored: not your individual
answers, how long you took, or which pages you visited.

Security rules on the database allow only you, signed in, to read or change your own progress.

Google processes this data for us as a service provider. See the
[Firebase privacy and security information](https://firebase.google.com/support/privacy) and the
[Google Privacy Policy](https://policies.google.com/privacy).

The website contacts Google's sign-in and database services only after you click **Sign in**, and
on later visits while you stay signed in. It never shows your profile photo, so it makes no
request to load it.

## Deleting your data

- **Signed-in data:** open the account menu (your initial, top right) and choose **Delete synced
  data**. This deletes your synced progress and your account straight away. You can also email us
  and we will delete it for you.
- **Signing out** keeps your synced data, so you can sign in again later.
- **Browser data:** progress saved in your browser stays there until you clear this site's data.

## What we do not do

- No analytics, tracking cookies or advertising.
- No selling or sharing of your data.
- No emails sent to you. Your address is used only to identify your account.

## Hosting

The website is served by Firebase Hosting. Like any web server, it receives your IP address and
browser details to deliver the pages. We do not use them to identify or track you.

## Children

The website is a study tool for professional certifications and is not directed at children.

## Changes to this policy

If this policy changes, the updated version will be posted on this page with a new "Last updated"
date.

## Contact

Questions about this policy, or requests to delete your data, can be sent to
[harshareddygudipati@gmail.com](mailto:harshareddygudipati@gmail.com).

---

Get Your Cert is unofficial practice material and is not affiliated with or endorsed by Amazon Web
Services, Google, Microsoft, the CNCF, or Databricks.
