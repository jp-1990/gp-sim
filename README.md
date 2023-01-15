# GP - SIM

A server-side/static generated site built using Next.js and Firebase.

## Summary

This project aimed to solve a problem in the simulation-racing world, initially targetting Assetto Corsa Competizione (ACC). Enthusiasts often like to use custom liveries (skins) on their cars while racing both casually, and within organised E-Sports events. There is currently no easy way for users to share these liveries between each other, with applications like Discord being used to fill this gap. This project presents an alternative, where artists can upload their liveries, and other users may download these, or add them to custom collections (garages). Other users who also belong to that garage can then download these liveries with a couple of clicks, streamlining the process of sharing all liveries within a group of users significantly.

## What I learned

Typically, heavily opinionated styling solutions have not been my favourite thing. I decided to give Chakra UI a try for this project, in the hope that the claims of accessibility and modularity would hold true, while giving the quick 'good enough' look that styling frameworks are famous for. I have found it to be a good balance between extendibility and pre-built solutions. The components accept styling props similar to how Tailwind utility classes work, giving a large amount of control over common things that might need adjustment in a lot of real world use cases, without having to jump through a number of hoops to get there.

Primarily, that Redux was not a good choice for this type of application. Initially, RTK Query was also in use, but this proved incompatible with the project requirements to such a degree that it was removed. Redux in this context has become a cache layer for thunk-based data fetching, and serves little purpose beyond this. With the additional complexity of syncing the server and client-side stores, Redux proved to be more of a block than a useful tool in this specific use case. I was aware when selecting it, that it was probably unnecessary, however I was looking to learn more about it, and on balance, do not regret my decision. It has proved a useful learning experience for working with entity adapters, thunks and the RTK ecosystem in general.

This project was the first time I've used MSW, and it proved incredibly useful for both automated testing, and manually testing without a connected database. It allowed me to build out most of the client-side without setting up the database, using mocked responses to network requests. I had an incomplete plan for the database layout when I started, and this approach allowed me to test different approaches without needing to modify any server-side code. Once I reach the stage where I needed to configure Firestore, I had already encountered and solved a number of problems through MSW mocking, which made setting up Firestore a smooth process.

## Technologies Used

- Next.js
- React
- Redux (RTK)
- TypeScript
- Chakra UI
- Firebase
- Jest
- MSW
