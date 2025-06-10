export type OnboardingSlideTypes = {
    color: string;
    image: any;
    title: string;
    secondTitle: string;
    subTitle: string;
}

type onBoardingSlidesTypes = {
    color: string;
    image: any;
    title: string;
    secondTitle: string;
    subTitle: string;
};

type UserType = {
    id: string;
    name: string;
    email: string;
    password: string;
    phone_number: string;
    avatar: string;
    avatarUrl?: string;
    stripeCustomerId: string;
    githubUserName: string;
    role: string;
    pushToken?: string;
    verified: boolean;
    reviews: ReviewsType[];
    orders: OrderType[];
    reviewsReplies: ReviewsType[];
    Notification: NotificationType[];
    tickets: TicketsTypes[];
    createdAt: Date;
    updatedAt: Date;
};

type ReviewsType = {
    id: string;
    user: UserType;
    userId: string;
    courseId: string;
    rating: number;
    replies: any[];
    comment: string;
    createdAt: any;
    updatedAt: any;
};

type OrderType = {
    id: string;
    userId: string;
    payment_info: string | null;
    courseId: string;
    createdAt: any;
    updatedAt: any;
};

type AnswerType = {
    id: string;
    userId: string;
    questionId: string;
    answer: string;
    user: UserType;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
};

type BenefitsType = {
    id: string;
    title: string;
    courseId: string;
    createdAt: any;
    updatedAt: any;
};

type QuestionType = {
    id: string;
    userId: string;
    user: UserType;
    contentId: string;
    question: string;
    image?: string;
    answers: AnswerType[];
    createdAt: Date;
    updatedAt: Date;
};

type QuestionType = {
    id: string;
    userId: string;
    user: UserType;
    contentId: string;
    question: string;
    image?: string;
    answers: AnswerType[];
    createdAt: Date;
    updatedAt: Date;
};

type CourseDataType = {
    id: string;
    title: string;
    videoUrl: string;
    conversationId?: string;
    videoSection: string;
    questions: QuestionType[];
    description: string;
    videoLength: string;
    links: any;
    videoPlayer: string | null;
    courseId: string;
};

type NotificationType = {
    id: string;
    title: string;
    message: string;
    status: string;
    creator?: UserType;
    creatorId: string;
    receiverId: string | null;
    redirect_link: string | null;
    createdAt: Date;
    updatedAt: Date;
};

type TicketReplies = {
    id: string;
    ticketId: string;
    reply: string;
    user: UserType;
    replyId: string;
    createdAt: Date | null;
    updatedAt: Date | null;
};

type NotificationStatus = "UNREAD" | "READ" | "ARCHIVED" | "CLOSED";


type TicketsTypes = {
    id: string;
    creatorId: string;
    ticketTitle: string;
    reply: TicketReplies[];
    details: string;
    status: NotificationStatus;
    createdAt: Date;
    updatedAt: Date;
};

type CourseType = {
    id: string;
    name: string;
    description: string;
    categories: string | null;
    price: number;
    estimatedPrice: number | null;
    thumbnail: string;
    tags: string;
    level: string;
    demoUrl: string;
    slug: string;
    lessons: number;
    payment_id: string | null;
    ratings: number;
    purchased: number;
    iosProductId?: string;
    androidProductId?: string;
    benefits: BenefitsType[];
    prerequisites: BenefitsType[];
    content: CourseDataType[];
    reviews: ReviewsType[];
    orders: OrderType[];
    createdAt: any;
    updatedAt: any;
};