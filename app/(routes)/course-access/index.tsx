import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CourseAccess from '@/components/screen/courses/course-access';


export default function CourseDetailsScreen() {
    return (
        <GestureHandlerRootView>
            <CourseAccess />
        </GestureHandlerRootView>
    )
}
