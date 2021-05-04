export type ErrorMessage = {
  title: string;
  message: string;
};

export const DEFAULT_TITLE = 'Đã xảy ra lỗi';
export const DEFAULT_MESSAGE = 'Hệ thống bị gián đoạn. Vui lòng thử lại';

export const USER_EXISTED: ErrorMessage = {
  title: DEFAULT_TITLE,
  message: 'Số điện thoại đã tồn tại. Vui lòng sử dụng số điện thoại khác để đăng ký.',
};

export const REGISTER_SUCCESSFULLY: ErrorMessage = {
  title: 'Đăng ký thành công',
  message: 'Tài khoản của bạn đã được khởi tạo thành công. Nhấn Tiếp Tục để đến bước tiếp theo.',
};

export const UPLOAD_AVATAR: ErrorMessage = {
  title: 'Thay đổi ảnh đại diện thành công',
  message: '',
};
