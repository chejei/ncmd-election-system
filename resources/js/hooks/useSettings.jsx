import { useEffect, useState } from "react";
import axios from "../api/axios"; 

export default function useSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/settings")
      .then(res => setSettings(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}
