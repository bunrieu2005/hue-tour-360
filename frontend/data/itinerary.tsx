// Đường dẫn: data/itinerary.tsx
import { Bus, Coffee, Map, ShoppingBag, Users, Palette } from "lucide-react";

export const ITINERARY_STEPS = [
    {
        time: "7h30 - 8h00",
        title: "Xuất phát",
        desc: "Tập trung tại trung tâm TP. Huế. Phổ biến lịch trình và lên xe di chuyển về làng nghề.",
        color: "bg-emerald-100",
        headerColor: "bg-emerald-600",
        textColor: "text-emerald-900",
        icon: <Bus className="w-5 h-5 text-white" />
    },
    {
        time: "8h00 - 9h00",
        title: "Giới thiệu & Khám phá",
        desc: "Đón khách, ổn định. Tham quan không gian, lắng nghe nghệ nhân kể chuyện lịch sử làng nghề.",
        color: "bg-orange-100",
        headerColor: "bg-orange-500",
        textColor: "text-orange-900",
        icon: <Users className="w-5 h-5 text-white" />
    },
    {
        time: "9h00 - 9h30",
        title: "Tea Break",
        desc: "Nghỉ giải lao, thưởng thức trà thảo mộc, bánh mứt đặc sản Huế và giao lưu chụp ảnh.",
        color: "bg-rose-100",
        headerColor: "bg-rose-500",
        textColor: "text-rose-900",
        icon: <Coffee className="w-5 h-5 text-white" />
    },
    {
        time: "9h30 - 10h30",
        title: "Thực hành làm nghề",
        desc: "Đích thân trải nghiệm từng công đoạn tự tay làm ra sản phẩm dưới sự hướng dẫn của nghệ nhân.",
        color: "bg-green-100",
        headerColor: "bg-green-600",
        textColor: "text-green-900",
        icon: <Palette className="w-5 h-5 text-white" />
    },
    {
        time: "10h30 - 11h30",
        title: "Nhận quà & Trở về",
        desc: "Đóng gói thành phẩm mang về. Mua sắm quà lưu niệm, thu dọn đồ đạc và lên xe trở về.",
        color: "bg-purple-100",
        headerColor: "bg-purple-500",
        textColor: "text-purple-900",
        icon: <ShoppingBag className="w-5 h-5 text-white" />
    },
];