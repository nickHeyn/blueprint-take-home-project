# Blueprint Take Home Project

## Overview

### Link to hosted web app:

https://blueprint-take-home-project.vercel.app/

### Problem statement

Currently, clinicians need to manually choose and assign assessments to patients and sometimes need to review each one before assigning it.

To help clinicians with this, we need to launch a **diagnostic screener** for patients. This screener covers a wide variety of symptoms and will assign assessments to patients based on their answers.

### Solution

My solution is a webapp that is hosted on Vercel. This webapp displays the diagnostic screener to the user, has them answer the questions, and then submits their answers to the backend to evaluate and return their Level-2 Assessments.

The webapp utilizes 2 API endpoints that are secured with Vercel OIDC tokens:

`/api/screener/diagnostic` - Accepts GET requests to fetch the diagnostic screener questions, potential answers, and other screener metadata.

`/api/screener/diagnostic/submit` - Accepts a POST request to submit answers for the diagnostic screener. Returns a list of strings that are the names of the Level-2 assessments calculated from the answers.

Once the user enters the webapp and begins the assessment, the screener questionare is server-side rendered with the screener questions which is fetched from the above endpoint and displayed one-at-a-time. Once the user has finished the questions and clicks submit, another request with the answers is sent to the submit endpoint mentioned above. The logic in this endpoint calculates the appropiate Level-2 assessments based on the answers and returns them so they are displayed to the user.

The data for the diagnostic screener is all stored in a PostgresSQL database. This database contains tables for the questions, answers, domains, screener metadata, sections, and also the mapping for the domains to Level-2 assessments. I set up a prisma seed script to generate the data for the diagnostic screener.

#### Technologies used

To build this diagnostic screener, I used the Next.js React framework to build out the web app with Typescript. I chose this framework because of it's support for server-side rendering to optimize performance and also for how it speeds up my development-time thanks to its built-in routing and useful tools like fast-refresh.

For the database, I used a PostgresSQL DB with Prisma ORM. I decided to use Prisma to again speed up development-time because of how Prisma abstracts away a lot of the boilerplate that is required to write SQL queries. I also chose it because its DB queries are type-safe which will help limit potential bugs.

Lastly, I utilized the [Material UI design system](https://mui.com/material-ui/getting-started/) in my app's UI. This is because that design system comes with many prebuilt and styled components that are production-ready right out of the box.

#### Things I would do differently

- Question and answer storage - I stored the screener questions and answers in their own tables in a PostgresDB. I originally did this because I figured questions and answers might get re-used for other screeners/assessments, so I wanted to limit redundancy. I also wanted to make it possible for questions and answers to be edited without having to make a code change (opening up the possibility for clincians to be able to edit questions and answers). However, the way I structured it is a bit limiting. I can't define an order that questions appear in the screener without adding an additional column in the screener or section table which adds the redundancy that I was trying to avoid. If question order is something that matters to stakeholders, I would instead store questions as a JSON object in the Section table instead of them having their own table. This may add redundancy for re-used questions, but it lets us define the question order and still allow for questions to be updated without a deploy.

## Remaining work to be production-ready

There are a number of things I would want to update before considering this application to be production-ready.

- **Increase Test Coverage:** Right now, I just have a handful of unit tests that test the Screener Service. Ideally, I'd add some end-to-end tests that run against the UI itself using a testing framework like Cypress.
- **Improve Security:** The app itself isn't very secure right now. I'm storing secrets/keys in environment variables and I didn't have time to add user authentication. To make this production-ready, I'd want to store secrets somewhere secure that's not an environment variable, probably in AWS Secrets Manager. I'd also want to add in user authentication using something like NextAuth for OAuth with Google, Github, etc. Doing this would secure the app for only authorized users and also help identify which patients are taking the diagnostic screener.
- **Do something with assessment results:** The diagnostic screener currently just outputs the Level 2 Assessments to the screen. I'd like to store the results of the diagnostic screener in the DB and also tell the user what to do with their results (Maybe link them to the Level 2 assessment they were assigned?).
- **Add beta environment:** There is currently just a single hosted environment which is the production environment. A beta environment should be added to let us run tests in. This would help decrease the odds of major bugs ending up in production.
- **Ensure higher availability:** I went with Vercel for my hosting solution mostly because it was free for me to use and has a great developer experience. That being said, the free tier on Vercel is definitely not what I'd want to use for production. The hosting solution I would go with would depend on how much the service is predicted to scale. If the average service TPS is high, then I'd probably want to host the webapp on AWS EC2 instances. I would then make sure to set up load balancers and caching to ensure high availability. This could also be handled for me by going with Vercel since it's serverless, but I believe the pricing would be a lot higher for a high-traffic app. If the traffic is predicted to be lower, then I would use a serverless hosting solution like Vercel so I could focus more on development.
- **Add logging/metrics solution:** The app currently only uses console logs. This would make maintaining the app difficult as there would have little insight into any potential issues that arise. I would want to intergrate the webapp with a logging/metrics service like Datadog and set up monitors/alarms. Doing so would give much wider visibility into the webapp and would notify engineers to production problems faster.

## More info about me

Feel free to take a look at me resume [here](./public/resume.pdf).

### Code that I'm proud of

I don't have a link to this since it's something I built at Amazon, but I'll describe it here instead.

When I was at Shopbop (Amazon subsidiary), we had many international customers. These international customers had to pay Duties and Taxes (DAT) when they placed orders. The amount of DAT we charged them was based on an estimate at the time of purchase. If we undercharged them, then Shopbop ate the cost, but if we overcharged them, then the customer would need to be refunded the difference.

Originally, these DAT refunds were done manually by the Customer Service team. They would get a generated report of customers that needed the refunds and would issue them one-by-one manually.

I built an AWS Lambda that would handle these refunds automatically. I set up the report so that it got sent to an S3 bucket biweekly. Once it was in the bucket, the Lambda would be triggered and would parse the report and then queue up refunds in an SQS queue. A different Lambda would then pull the refunds from that queue and send requests to our payment service to issue the refund to the customer.

After this was built, we were able to automate ~97% of all DAT refunds, equivalent to ~137K automated refunds and thousands of saved labor hours for the Customer Service team. I'm really proud of the impact that project had!
