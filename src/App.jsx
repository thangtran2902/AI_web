import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [predictions, setPredictions] = useState(""); // Kết quả dự đoán (Có người / Không có người)
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Lưu thông báo lỗi
  const [alertMessage, setAlertMessage] = useState(""); // Lưu thông báo có người lạ
  const [isConfirmed, setIsConfirmed] = useState(false); // Kiểm tra nếu người quen đã xác nhận

  useEffect(() => {
    const interval = setInterval(() => {
      getPredictions(); // Lấy dự đoán mới sau mỗi 5 giây
    }, 5000); // Lấy dự đoán mỗi 5 giây

    // Dọn dẹp interval khi component bị hủy
    return () => clearInterval(interval);
  }, []);

  const getPredictions = async () => {
    setLoading(true);
    setErrorMessage(""); // Reset lỗi khi bắt đầu tải lại
    setAlertMessage(""); // Reset thông báo có người lạ
    setIsConfirmed(false); // Reset xác nhận người quen

    try {
      const response = await axios.get("http://localhost:3001/predict");
      const prediction = response.data.predictions[0]; // Chỉ lấy kết quả dự đoán đầu tiên
      setPredictions(prediction);

      // Nếu có người, hiển thị thông báo
      if (prediction === "Co nguoi") {
        setAlertMessage("Có người lạ!");
        sendNotification("Có người lạ, vui lòng xác nhận!");
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);

      if (error.response) {
        setErrorMessage(
          `Server Error: ${error.response.data.error || "Unknown error"}`
        );
      } else {
        setErrorMessage("Network error or server not reachable");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setAlertMessage(""); // Xóa thông báo khi xác nhận người quen
    setIsConfirmed(true); // Đánh dấu đã xác nhận
  };

  const sendNotification = (message) => {
    // Gửi thông báo (có thể gửi qua backend hoặc hiển thị thông báo trong UI)
    console.log(message); // Ở đây chỉ hiển thị thông báo trong console
  };

  return (
    <div className="h-screen bg-gradient-to-r from-purple-500 to-pink-500 flex flex-col justify-center items-center">
      {/* Tiêu đề */}
      <h1 className="text-5xl font-bold font-sans text-white bg-black py-3 px-6 rounded-md shadow-lg mb-8 animate-bounce">
        HỆ THỐNG PHÁT HIỆN NGƯỜI THÂN
      </h1>

      {/* Thông báo lỗi */}
      {errorMessage && (
        <div className="text-red-500 font-semibold bg-white py-2 px-4 rounded-md shadow-md mb-4">
          <strong>{errorMessage}</strong>
        </div>
      )}

      {/* Tin nhắn cảnh báo */}
      {alertMessage && !isConfirmed && (
        <div className="flex flex-col justify-center items-center bg-white py-6 px-8 rounded-lg shadow-md mb-6 animate-pulse">
          <p className="text-xl font-semibold text-gray-800 mb-4">
            {alertMessage}
          </p>
          <button
            onClick={handleConfirm}
            className="rounded-md bg-purple-600 text-white px-6 py-2 hover:bg-purple-700 transition-all duration-300"
          >
            Xác nhận là người quen
          </button>
        </div>
      )}

      {/* Trạng thái dự đoán */}
      {predictions && (
        <div className="flex items-center justify-center text-lg font-medium text-gray-900 bg-white py-3 px-6 rounded-md shadow-lg">
          <h3 className="mr-2">Trạng thái hiện tại:</h3>
          <p className="text-purple-600 font-bold">
            {predictions === "Co nguoi" ? "Có người" : "Không có người"}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
