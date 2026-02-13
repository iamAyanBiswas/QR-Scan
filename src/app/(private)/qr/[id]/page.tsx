export default async function ViewQR({ params }: { params: { id: Promise<string> } }) {
    const { id } = await params
    if (!id || (await id).length !== 6) {
        console.log({ len: id })
        return (
            <div>Invalid ID</div>
        )
    } else {
        return (
            <div>{id}</div>
        )
    }
}