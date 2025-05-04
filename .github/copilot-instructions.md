We use [Expo](https://expo.dev/) with React Native and TypeScript for all UI components.  
Use [React Native Paper](https://callstack.github.io/react-native-paper/) for consistent app styling.  
Handle data fetching with [Tanstack Query](https://tanstack.com/query); separate queries (GET) from mutations (POST/PUT).  
Use [Axios](https://axios-http.com/), configured in [lib/axios-config.ts](/src/lib/axios-config.ts), for all HTTP requests.  
Manage global settings (themes, authentication) in Zustand (located in the `/store` directory) only.  
Cache API-fetched data with Tanstack Query, not Zustand.  
Validate forms using [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/); define schemas in files located in `/features/[feature]/services`.  
Ask clarifying questions if any requirement or code context is missing.  

