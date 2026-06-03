export const onRequest: PagesFunction<Env> = async (context) => {
	return Response.json({
		name: "Cloudflare",
	});
};
