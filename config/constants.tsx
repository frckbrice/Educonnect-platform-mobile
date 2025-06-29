import { IsIPAD } from "@/utils/app-constant";
import { Dimensions, Image } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
//@ts-ignore
import One from "@/assets/images/onboarding/1.png";
//@ts-ignore
import Two from "@/assets/images/onboarding/2.png";
//@ts-ignore
import Three from "@/assets/images/onboarding/3.png";
import { CourseDataType, OnboardingSlideTypes } from "./global";
import { title } from "process";

export const onBoardingSlides: OnboardingSlideTypes[] = [
  {
    color: "#40E0D0",
    title: "Explore",
    image: (
      <Image
        source={One}
        style={{
          width: IsIPAD ? verticalScale(285) : verticalScale(320),
          height: IsIPAD ? verticalScale(345) : verticalScale(330),
        }}
      />
    ),
    secondTitle: "Our Community",
    subTitle:
      "Find the perfect course to enhance your career prospects and skill set",
  },
  {
    color: "#A7F893",
    title: "Set Your",
    image: (
      <Image
        source={Two}
        style={{
          width: IsIPAD ? scale(285) : scale(320),
          height: IsIPAD ? verticalScale(345) : verticalScale(330),
        }}
      />
    ),
    secondTitle: "Own Goal",
    subTitle:
      "Personalize your study plan with flexible timelines that suit you best",
  },
  {
    color: "#FFC0CB",
    image: (
      <Image
        source={Three}
        style={{
          width: IsIPAD ? scale(285) : scale(320),
          height: IsIPAD ? verticalScale(345) : verticalScale(330),
        }}
      />
    ),
    title: "Complete full",
    secondTitle: "Course",
    subTitle:
      "Achieve certification by completing courses with dedicated effort",
  },
];

// onboarding variables
export enum Side {
  LEFT,
  RIGHT,
  NONE,
}
export const MIN_LEDGE = 25;
export const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");
export const MARGIN_WIDTH = MIN_LEDGE + 50;
export const PREV = WIDTH;
export const NEXT = 0;
export const LEFT_SNAP_POINTS = [MARGIN_WIDTH, PREV];
export const RIGHT_SNAP_POINTS = [NEXT, WIDTH - MARGIN_WIDTH];

// banner data
export const bannerData = [
  {
    image:
      "https://res.cloudinary.com/dkg6jv4l0/image/upload/v1731710065/Let_s-build-a-production-ready-LMS-Mobile-App-with-Expo-React-Native_ahqpvx.png",
    url: "https://youtu.be/0sfVmH5_nj4",
  },
  {
    image:
      "https://res.cloudinary.com/dwp4syk3r/image/upload/v1713574008/WhatsApp_Image_2024-02-29_at_2.00.10_AM_zpk4qe.jpg",
    url: "https://youtu.be/BrrwtCt7d-Y",
  },
  {
    image:
      "https://res.cloudinary.com/dkg6jv4l0/image/upload/v1723424082/WhatsApp_Image_2024-08-09_at_5.00.52_AM_wzokd1.jpg",
    url: "https://youtu.be/4aS7g8OYHbg",
  },
];

export const videoLessonsData = [
  {
    url: "https://youtu.be/hGB-6VAcM6U",
    thumbnail:
      "https://res.cloudinary.com/dwp4syk3r/image/upload/v1717660359/WhatsApp_Image_2024-06-04_at_4.31.27_AM_afd4bw.jpg",
    title:
      "All Functional LMS mobile App with React Native,Expo,Typescript,Express js",
  },
  {
    url: "https://youtu.be/BrrwtCt7d-Y",
    thumbnail:
      "https://res.cloudinary.com/dwp4syk3r/image/upload/v1713574008/WhatsApp_Image_2024-02-29_at_2.00.10_AM_zpk4qe.jpg",

    title:
      "SaaS Email Newsletter platform by using next14, typescript, AWS SES, AstraDb, Stripe",
  },
  {
    url: "https://youtu.be/mzbOqy5DWzE",
    thumbnail:
      "https://res.cloudinary.com/dwp4syk3r/image/upload/v1713574100/AI_Prompt_Selling_Marketplace_with_next_13.5_Full_Project_ezvziv.png",
    title:
      "SaaS Email Newsletter platform by using next14, typescript, AWS SES, AstraDb, Stripe",
  },
  {
    url: "https://youtu.be/UxirFATvWTo",
    thumbnail:
      "https://res.cloudinary.com/dwp4syk3r/image/upload/v1713574204/Food_Delivery_Web_App_anntu1.png",
    title:
      "Food Delivery Web Application using Microservice Architecture with Nest.js,GraphQL,Next.js",
  },
  {
    url: "https://youtu.be/h4dW5LNtcoE",
    thumbnail:
      "https://res.cloudinary.com/dwp4syk3r/image/upload/v1713574236/Let_s_Build_a_Full-stack_website_without_backend_ny0lcl.png",
    title:
      "Let's Make a Full-stack Website Without a Backend Next 14 | OneEntry CMS | Tailwind css | Typescript",
  },
  {
    url: "https://youtu.be/4aS7g8OYHbg",
    thumbnail:
      "https://res.cloudinary.com/dkg6jv4l0/image/upload/v1723424082/WhatsApp_Image_2024-08-09_at_5.00.52_AM_wzokd1.jpg",
    title:
      "Let's build one real-time car booking full-stack mobile app by using Expo React Native",
  },
];

export const NotificationsData = [
  {
    id: "1",
    title: "New Answer Received",
    message: "You have a new answer in your question",
    status: "Unread",
  },
  {
    id: "2",
    title: "New Reply Received",
    message: "You have a new reply in your support question",
    status: "Unread",
  },
];


export const FAQData = [
  {
    id: 1,
    question: "Will I receive a certificate for each course?",
    answer:
      "Yes — each student who completes any course will receive a certificate of completion to acknowledge their proficiency. We encourage students to include these on their LinkedIn profiles and in their job applications!",
  },
  {
    id: 2,
    question: "Can I get source code of each course?",
    answer:
      "Yes - You will get source code of all courses when you will watch the course video.",
  },
  {
    id: 3,
    question:
      "Can I ask about anything related course or if my code dosen't work?",
    answer:
      "Yes, you can comment on every part of the videos in the course. We'll always try to reply to your comment and fix any issues you may have.",
  },
  {
    id: 4,
    question: "Can I download any course videos?",
    answer:
      "For security reasons, course videos cannot be downloaded. However, you have lifetime access to each purchased course and can watch them anytime, anywhere with your account",
  },
];

export const CourseData: any = [
  {
    id: "683d77d4a1b65694b0cfd348",
    title: "Full Stack Web Development",
    description:
      "Learn the fundamentals of web development, including HTML, CSS, JavaScript, and backend technologies.",
    thumbnail: "https://images.pexels.com/photos/15099919/pexels-photo-15099919/free-photo-of-portrait-of-a-woman-wearing-a-hat.jpeg?auto=compress&cs=tinysrgb&w=1200",
    slug: "multi-vendor-mern-stack-e-commerce-project-with-all-functionalities-absolutely-for-beginners",
    content: [
      {
        id: "683d77d4a1b65694b0cfd34a",
        description: "Learn the basics of data science, including data collection and preprocessing.",
        title: "Introduction to Data Science",
        videoLength: "12:00",
        videoSection: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        videoUrl: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        videoPlayer: "Vimeo",
        courseId: "683d77d4a1b65694b0cfd348",
        links: [
          {
            id: "507f1f77bcf86cd799439011",
            title: "React Official Documentation",
            url: "https://react.dev/learn",
            contentId: "683d77d4a1b65694b0cfd34a"
          },
          {
            id: "507f1f77bcf86cd799439012",
            title: "expo documentation",
            url: "https://docs.expo.dev/versions/latest/",
            contentId: "683d77d4a1b65694b0cfd34a"
          }
        ]
      },

      {
        id: "683d77d4a1b65694b0cfd349",
        "description": "Explore SEO, social media marketing, and campaign analytics tailored f…",
        "title": "Digital Marketing Strategy for Startups",
        "videoLength": "20:00",
        "videoSection": "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        "videoUrl": "https://www.youtube.com/watch?v=nkK1bT8ls0M",
        videoPlayer: "YouTube",
        courseId: "683d77d4a1b65694b0cfd348",
        links: [
          {
            id: "507f1f77bcf86cd799439011",
            title: "React Official Documentation",
            url: "https://react.dev/learn",
            contentId: "683d77d4a1b65694b0cfd34a"
          },
          {
            id: "507f1f77bcf86cd799439012",
            title: "expo documentation",
            url: "https://docs.expo.dev/versions/latest/",
            contentId: "683d77d4a1b65694b0cfd34a"
          },
          {
            id: "507f1f77bcf86cd799439013",
            title: "typeSript documentation",
            url: "https://www.typescriptlang.org/docs/handbook/basic-types.html",
            contentId: "683d77d4a1b65694b0cfd34a"
          }
        ]
      },
      {
        id: "6845459ceec50cb7a58b3008",
        "description": "Learn how to visualize data using libraries like Matplotlib and Seaborn.",
        "title": "Data Visualization",
        "videoLength": "18:00",
        "videoSection": "https://www.youtube.com/watch?v=SSo_EIwHSd4",
        "videoUrl": "https://www.youtube.com/watch?v=SSo_EIwHSd4",
        videoPlayer: "YouTube",
        courseId: "683d77d4a1b65694b0cfd348",
        links: [
          {
            id: "507f1f77bcf86cd799439011",
            title: "React Official Documentation",
            url: "https://react.dev/learn",
            contentId: "683d77d4a1b65694b0cfd34a"
          },
          {
            id: "507f1f77bcf86cd799439012",
            title: "expo documentation",
            url: "https://docs.expo.dev/versions/latest/",
            contentId: "683d77d4a1b65694b0cfd34a"
          }, {
            id: "507f1f77bcf86cd799439013",
            title: "React-native documentation",
            url: "https://reactnative.dev/docs/getting-started",
            contentId: "683d77d4a1b65694b0cfd34a"
          }
        ]
      }
    ],
    benefits: [{
      title: "Hands-on Projects",
      description:
        "Build real-world projects to enhance your portfolio and practical skills.",
    },
    {
      title: "Expert Instructors",
      description:
        "Learn from industry experts with years of experience in web development.",
    },
    {
      title: "Community Support",
      description:
        "Join a community of learners and get support from fellow students and instructors.",
    }],
    prerequisites: [
      {
        title: "Basic Computer Skills",
        description:
          "Familiarity with using a computer and navigating the internet.",
      },
      {
        title: "Basic HTML/CSS Knowledge",
        description:
          "Understanding of basic HTML and CSS concepts is helpful but not mandatory.",
      },
      {
        title: "Willingness to Learn",
        description:
          "A positive attitude and eagerness to learn new technologies and concepts.",
      }
    ],
    ratings: 3.5,
    purchased: 1000,
    estimatedPrice: 50,
    price: 35,
  },
  {
    id: "683d77d9a1b65694b0cfd35a",
    title: "Data Science and Machine Learning",
    description:
      "Dive into data analysis, visualization, and machine learning algorithms using Python.",
    thumbnail: "https://images.pexels.com/photos/2524224/pexels-photo-2524224.jpeg?auto=compress&cs=tinysrgb&w=1200",
    slug: "build-your-mobile-app-development-career-with-react-native",
    content: [
      {
        id: "683d77d4a1b65694b0cfd34a",
        title: "Introduction to Data Science",
        description:
          "Learn the basics of data science, including data collection and preprocessing.",
        videoUrl: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        videoLength: "12:00",
        videoSection: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        courseId: "683d77d9a1b65694b0cfd35a",
        links: [
          {
            id: "507f1f77bcf86cd799439011",
            title: "React Official Documentation",
            url: "https://react.dev/learn",
            contentId: "683d77d4a1b65694b0cfd34a"
          },
          {
            id: "507f1f77bcf86cd799439012",
            title: "expo documentation",
            url: "https://docs.expo.dev/versions/latest/",
            contentId: "683d77d4a1b65694b0cfd34a"
          }
        ]
      },
      {
        id: "6845459ceec50cb7a58b3008",
        title: "Machine Learning Algorithms",
        description:
          "Understand various machine learning algorithms and their applications.",
        videoUrl: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        videoLength: "20:00",
        videoSection: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        courseId: "683d77d9a1b65694b0cfd35a",
        links: [
          {
            id: "507f1f77bcf86cd799439011",
            title: "React Official Documentation",
            url: "https://react.dev/learn",
            contentId: "683d77d4a1b65694b0cfd34a"
          },
          {
            id: "507f1f77bcf86cd799439012",
            title: "expo documentation",
            url: "https://docs.expo.dev/versions/latest/",
            contentId: "683d77d4a1b65694b0cfd34a"
          },
          {
            id: "507f1f77bcf86cd799439013",
            title: "typeSript documentation",
            url: "https://www.typescriptlang.org/docs/handbook/basic-types.html",
            contentId: "683d77d4a1b65694b0cfd34a"
          }
        ]
      },
      {
        id: "683d77d4a1b65694b0cfd349",
        title: "Data Visualization",
        description:
          "Learn how to visualize data using libraries like Matplotlib and Seaborn.",
        videoUrl: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        videoLength: "18:00",
        videoSection: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        courseId: "683d77d9a1b65694b0cfd35a",
        links: [
          {
            id: "507f1f77bcf86cd799439011",
            title: "React Official Documentation",
            url: "https://react.dev/learn",
            contentId: "683d77d4a1b65694b0cfd34a"
          },
          {
            id: "507f1f77bcf86cd799439012",
            title: "expo documentation",
            url: "https://docs.expo.dev/versions/latest/",
            contentId: "683d77d4a1b65694b0cfd34a"
          }, {
            id: "507f1f77bcf86cd799439013",
            title: "React-native documentation",
            url: "https://reactnative.dev/docs/getting-started",
            contentId: "683d77d4a1b65694b0cfd34a"
          }
        ]
      },
    ],
    benefits: [{
      title: "Hands-on Projects",
      description:
        "Build real-world projects to enhance your portfolio and practical skills.",
    },
    {
      title: "Expert Instructors",
      description:
        "Learn from industry experts with years of experience in web development.",
    },
    {
      title: "Community Support",
      description:
        "Join a community of learners and get support from fellow students and instructors.",
    }],
    prerequisites: [{
      title: "Basic Computer Skills",
      description:
        "Familiarity with using a computer and navigating the internet.",
    },
    {
      title: "Basic HTML/CSS Knowledge",
      description:
        "Understanding of basic HTML and CSS concepts is helpful but not mandatory.",
    },
    {
      title: "Willingness to Learn",
      description:
        "A positive attitude and eagerness to learn new technologies and concepts.",
      }],
    purchased: 300,
    ratings: 4,
    estimatedPrice: 68,
    price: 45,
  },
  {
    id: "683d77d9a1b65694b0cfd35b",
    title: "Advanced Python Programming",
    description:
      "Dive into data analysis, visualization, and machine learning algorithms using Python.",
    thumbnail: "https://images.pexels.com/photos/18485567/pexels-photo-18485567/free-photo-of-circular-economy-a-new-way-of-thinking-about-the-circular-economy.jpeg?auto=compress&cs=tinysrgb&w=1200",
    slug: "Advanced-Python-Programming",
    content: [
      {
        id: "683d77d4a1b65694b0cfd349",
        title: "Introduction to Data Science",
        description:
          "Learn the basics of data science, including data collection and preprocessing.",
        videoUrl: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        videoLength: "12:00",
        videoSection: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        courseId: "683d77d9a1b65694b0cfd35b",
        links: [
          {
            id: "507f1f77bcf86cd799439011",
            title: "React Official Documentation",
            url: "https://react.dev/learn",
            contentId: "683d77d4a1b65694b0cfd34a"
          },
          {
            id: "507f1f77bcf86cd799439012",
            title: "expo documentation",
            url: "https://docs.expo.dev/versions/latest/",
            contentId: "683d77d4a1b65694b0cfd34a"
          }, {
            id: "507f1f77bcf86cd799439013",
            title: "React-native documentation",
            url: "https://reactnative.dev/docs/getting-started",
            contentId: "683d77d4a1b65694b0cfd34a"
          }
        ]
      },
      {
        id: "683d77d4a1b65694b0cfd34a",
        title: "Machine Learning Algorithms",
        description:
          "Understand various machine learning algorithms and their applications.",
        videoUrl: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        videoLength: "20:00",
        videoSection: "https://www.youtube.com/watch?v=0sfVmH5_nj4",
        courseId: "683d77d4a1b65694b0cfd34a",
        links: [
          {
            id: "507f1f77bcf86cd799439011",
            title: "React Official Documentation",
            url: "https://react.dev/learn",
            contentId: "683d77d4a1b65694b0cfd34a"
          },
          {
            id: "507f1f77bcf86cd799439012",
            title: "expo documentation",
            url: "https://docs.expo.dev/versions/latest/",
            contentId: "683d77d4a1b65694b0cfd34a"
          },
          {
            id: "507f1f77bcf86cd799439013",
            title: "typeSript documentation",
            url: "https://www.typescriptlang.org/docs/handbook/basic-types.html",
            contentId: "683d77d4a1b65694b0cfd34a"
          }
        ]
      }
    ],
    benefits: [{
      title: "Hands-on Projects",
      description:
        "Build real-world projects to enhance your portfolio and practical skills.",
    },
    {
      title: "Expert Instructors",
      description:
        "Learn from industry experts with years of experience in web development.",
    },
    {
      title: "Community Support",
      description:
        "Join a community of learners and get support from fellow students and instructors.",
    }],
    prerequisites: [{
      title: "Basic Computer Skills",
      description:
        "Familiarity with using a computer and navigating the internet.",
    },
    {
      title: "Basic HTML/CSS Knowledge",
      description:
        "Understanding of basic HTML and CSS concepts is helpful but not mandatory.",
    },
    {
      title: "Willingness to Learn",
      description:
        "A positive attitude and eagerness to learn new technologies and concepts.",
      }],
    ratings: 3,
    purchased: 456,
    estimatedPrice: 45,
    price: 30,
  },
];