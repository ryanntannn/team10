![image](https://github.com/user-attachments/assets/68b0996e-40be-4b3d-809b-45a0316eeb91)
![image](https://github.com/user-attachments/assets/c37b3aa8-7e93-4cf1-9657-13b611f0bf66)


# tankiu.id

taniku.id helps indonesia's restaurants place scheduled and recurring orders from their local farms. This also helps local farms forecast their demand more and make better long term decisions.

tankiu.id was built for the SUTDxPCU FACT 2025 hackathon, and achieved 2nd place overall.

## Clone and run locally

1. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

2. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.
