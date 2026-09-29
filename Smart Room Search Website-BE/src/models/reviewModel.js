/**
 * Review Model
 * Manages anonymous and user-submitted room reviews.
 * Allows anyone to view and post reviews without requiring login.
 */

import { readJsonFile, writeJsonFile } from '../config/jsonDb.js';

const initialReviews = [
  {
    id: 1,
    room_id: 1,
    author: 'Nguyễn Văn Nam',
    rating: 5,
    comment: 'Phòng sạch sẽ, ban công thoáng mát, chủ nhà rất thân thiện và nhiệt tình hỗ trợ.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 2,
    room_id: 1,
    author: 'Người thuê ẩn danh',
    rating: 5,
    comment: 'An ninh 24/7 tốt, giờ giấc tự do, điện nước tính đúng giá cam kết. Đáng tiền!',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 3,
    room_id: 2,
    author: 'Lê Thị Thu',
    rating: 4,
    comment: 'Vị trí gần chợ và bến xe buýt, đi lại tiện lợi. Phòng hơi nhỏ một chút nhưng giá hợp lý.',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 4,
    room_id: 134719785,
    author: 'Sinh viên Văn Lang',
    rating: 5,
    comment: 'Ngay cổng trường đi bộ 3 phút, phòng mới xây nội thất mới 100%, wifi mạnh.',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 5,
    room_id: 702593,
    author: 'Người dùng ẩn danh',
    rating: 5,
    comment: 'Ký túc xá Q7 sạch sẽ, bao trọn gói điện nước máy lạnh 24/24 thật sự tiết kiệm cho sinh viên.',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 6,
    room_id: 649687,
    author: 'Hoàng Anh',
    rating: 5,
    comment: 'Hẻm xe hơi yên tĩnh, gần Hutech và GTVT, có bếp nấu ăn riêng rất tiện.',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
];

let inMemoryReviews = [...initialReviews];

const getReviews = () => {
  try {
    return readJsonFile('reviews_db.json', inMemoryReviews);
  } catch {
    return inMemoryReviews;
  }
};

const saveReviews = (reviews) => {
  inMemoryReviews = reviews;
  try {
    writeJsonFile('reviews_db.json', reviews);
  } catch {}
};

/**
 * Get all reviews for a room, sorted newest first
 */
export const getReviewsByRoomId = (roomId) => {
  const all = getReviews();
  const list = all.filter((r) => String(r.room_id) === String(roomId));
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

/**
 * Add a new review (anonymous permitted, no login required)
 */
export const addReview = (roomId, { rating, author, comment }) => {
  const all = getReviews();
  const cleanRating = Math.max(1, Math.min(5, Number(rating) || 5));
  const cleanAuthor = author && author.trim() ? author.trim() : 'Người dùng ẩn danh';
  const cleanComment = comment && comment.trim() ? comment.trim() : 'Đánh giá tốt!';

  const newReview = {
    id: Date.now(),
    room_id: isNaN(Number(roomId)) ? roomId : Number(roomId),
    author: cleanAuthor,
    rating: cleanRating,
    comment: cleanComment,
    created_at: new Date().toISOString(),
  };

  all.unshift(newReview);
  saveReviews(all);
  return newReview;
};
