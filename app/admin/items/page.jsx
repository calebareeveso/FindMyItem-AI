import ListItems from "../../../components/admin/list";
import { db } from "../../../lib/mongodb";

export const dynamic = "force-dynamic";

export default async function Page({ params, searchParams }) {
  const data = await db
    .collection("thoughts")
    .find({ imageUrl: { $exists: true, $ne: null } }) // Ensures imageUrl exists and is not null
    .toArray();
  const stringifyData = JSON.stringify(data);
  return (
    <div>
      <ListItems items={stringifyData} />
    </div>
  );
}
