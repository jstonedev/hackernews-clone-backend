const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
	const newLink = await prisma.link.create({
		data: {
			description: "First hackernews clone blog post",
			url: "www.hacknews.com",
		},
	});
	const allLinks = await prisma.link.findMany();
	console.log(allLinks);
}

main()
	.catch((e) => {
		throw e;
	})
	// 5
	.finally(async () => {
		await prisma.$disconnect();
	});
