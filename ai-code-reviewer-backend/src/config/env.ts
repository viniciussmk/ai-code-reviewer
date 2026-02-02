import 'dotenv/config';

const env = {
    openAiApiKey: process.env.OPENAI_API_KEY ?? '',
    port: Number(process.env.PORT ?? 3001),
};

export default env;
