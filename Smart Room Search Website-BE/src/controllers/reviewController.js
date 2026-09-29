import { getReviewsByRoomId, addReview } from '../models/reviewModel.js';

export const getRoomReviews = (req, res) => {
  try {
    const { id } = req.params;
    const reviews = getReviewsByRoomId(id);
    return res.status(200).json(reviews);
  } catch (error) {
    console.error('[reviews] get failed:', error);
    return res.status(500).json({ message: 'Lỗi khi lấy danh sách đánh giá' });
  }
};

export const createRoomReview = (req, res) => {
  try {
    const { id } = req.params;
    const { rating, author, comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'Nội dung đánh giá không được để trống' });
    }

    const review = addReview(id, { rating, author, comment });
    return res.status(201).json(review);
  } catch (error) {
    console.error('[reviews] create failed:', error);
    return res.status(500).json({ message: 'Lỗi khi gửi đánh giá' });
  }
};
