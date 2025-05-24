import { CourseType } from "@/config/global";
import { API_URL } from "@/utils/env-constant";
import axios from "axios";
import { useEffect, useState, useTransition } from "react";

const useGetCourses = () => {
    const [courses, setCourses] = useState<CourseType[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        setLoading(true);

        const fetchCourses = async () => {
            try {
                const response = await axios.get(`${API_URL}/courses`);

                // use to smooth the UX in case of large number of course
                startTransition(() => {
                    setCourses(response.data.courses);
                });
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return { courses, loading, isPending, error };
};

export default useGetCourses;
