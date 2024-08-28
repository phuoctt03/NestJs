step1: change  url = env("DATABASE_URL") to url = "mongodb+srv://phuoctt:2KveYlOxvmlsd4ll@phuoctt.n9eyoar.mongodb.net/youtub?retryWrites=true&w=majority" in schema.prisma
step2: npx prisma generate
step3: code file update.ts
step4: npx ts-node update.ts