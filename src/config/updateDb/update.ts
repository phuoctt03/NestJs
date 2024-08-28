import { PrismaService } from '../prisma/prisma.service';
const prisma = new PrismaService();
const updateDb = async () => {
    await prisma.avtUser.create({
        data: {
            UserID: "your_user_id_here",
            avatarUrl: "https://nestjs-8nvm.onrender.com/avt/66b1e3483b2f0765a0102867.2a13cea725c2246893ef5df2d5b661246c2efd1e6fdbb684a3169f2252bc3a16.gif",
            state: "active",
        },
    });
}
updateDb()
