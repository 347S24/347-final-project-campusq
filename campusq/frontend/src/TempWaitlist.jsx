import { use } from "express/lib/application";

export default function TempWaitlist() {
  const { waitcode } = useParams();

  useEffect(() => {
    const fetchWaitlist = async () => {
      const response = await fetch(
        `http://localhost:8000/api/waitlist/${waitcode}`
      );
      const data = await response.json();
      console.log(data);
    };

    fetchWaitlist();
  }, []);

  return (
    <div>
      <h1>TempWaitlist</h1>
    </div>
  );
}
