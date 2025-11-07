// Cấu hình ứng dụng trắc nghiệm
const ITEMS_PER_PAGE = 20;
let allExams = {}; // Chứa tất cả các đề thi
let quizData = []; // Câu hỏi của đề đang chọn
let currentExam = null; // Đề đang làm
let currentPage = 1;
let userAnswers = {};

// Khởi tạo ứng dụng
document.addEventListener("DOMContentLoaded", () => {
  loadQuizData();

  // Xử lý sự kiện back/forward của trình duyệt
  window.addEventListener("popstate", handlePopState);
});

// Tải dữ liệu quiz từ file JSON
async function loadQuizData() {
  try {
    const response = await fetch("quiz.json");
    if (!response.ok) {
      throw new Error("Không thể tải dữ liệu quiz");
    }
    allExams = await response.json();

    // Ẩn loading, hiện danh sách đề
    document.getElementById("loading").style.display = "none";
    document.getElementById("exam-selector").style.display = "block";

    // Kiểm tra URL params để load đề thi từ URL
    loadFromURL();

    // Hiển thị danh sách đề thi
    renderExamList();
  } catch (error) {
    console.error("Lỗi khi tải quiz:", error);
    document.getElementById("loading").style.display = "none";
    document.getElementById("error").classList.remove("d-none");
  }
}

// Load trạng thái từ URL
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  const examParam = params.get("exam");
  const pageParam = params.get("page");

  if (examParam && allExams[examParam]) {
    const page = pageParam ? parseInt(pageParam) : 1;
    selectExam(examParam, page, false); // false = không update URL
  }
}

// Xử lý sự kiện back/forward
function handlePopState(event) {
  if (event.state) {
    if (event.state.exam) {
      selectExam(event.state.exam, event.state.page, false);
    } else {
      // Quay lại trang chọn đề
      document.getElementById("quiz-container").style.display = "none";
      document.getElementById("exam-selector").style.display = "block";
      currentExam = null;
      scrollToTop();
    }
  }
}

// Cập nhật URL với trạng thái hiện tại
function updateURL(pushState = true) {
  if (!currentExam) return;

  const params = new URLSearchParams();
  params.set("exam", currentExam);
  params.set("page", currentPage);

  const newURL = `${window.location.pathname}?${params.toString()}`;

  if (pushState) {
    window.history.pushState(
      { exam: currentExam, page: currentPage },
      "",
      newURL
    );
  } else {
    window.history.replaceState(
      { exam: currentExam, page: currentPage },
      "",
      newURL
    );
  }
}

// Hiển thị danh sách đề thi
function renderExamList() {
  const examList = document.getElementById("exam-list");
  examList.innerHTML = "";

  Object.keys(allExams).forEach((examName) => {
    const button = document.createElement("button");
    button.className = "btn btn-primary btn-lg exam-button";
    button.innerHTML = `
      <i class="bi bi-file-text"></i> ${examName}
      <span class="badge bg-light text-dark ms-2">${allExams[examName].length} câu</span>
    `;
    button.onclick = () => selectExam(examName);
    examList.appendChild(button);
  });
}

// Chọn đề thi
function selectExam(examName, page = 1, updateUrl = true) {
  currentExam = examName;
  quizData = allExams[examName];
  currentPage = page;

  // Không reset câu trả lời nếu đang ở cùng đề
  if (updateUrl) {
    userAnswers = {}; // Reset câu trả lời khi chọn đề mới
  }

  // Ẩn danh sách đề, hiện quiz
  document.getElementById("exam-selector").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";

  // Cập nhật tiêu đề đề thi
  document.getElementById("current-exam-title").textContent = examName;

  // Hiển thị trang
  renderQuiz();
  renderPagination();

  // Cập nhật URL
  if (updateUrl) {
    updateURL(true);
  }

  // Thêm sự kiện nút quay lại
  document.getElementById("back-to-exams").onclick = () => {
    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("exam-selector").style.display = "block";
    currentExam = null;

    // Xóa params khỏi URL
    window.history.pushState({}, "", window.location.pathname);
    scrollToTop();
  };
}

// Trích xuất số câu hỏi và tạo đường dẫn ảnh
function getImagePathFromQuestion(questionText) {
  // Tìm pattern "Q. X:" hoặc "Q.X:" trong câu hỏi
  const match = questionText.match(/Q\.\s*(\d+)/i);

  if (match && match[1]) {
    const questionNumber = match[1];

    // Trả về đường dẫn mặc định (PNG)
    // Nếu file không tồn tại, sẽ bị catch bởi onerror và thử các định dạng khác
    return `img/q${questionNumber}.png`;
  }

  return null;
}

// Thử load ảnh với các định dạng khác nếu định dạng đầu tiên thất bại
function tryAlternativeImageFormats(imageElement, questionText, currentFormat) {
  const match = questionText.match(/Q\.\s*(\d+)/i);

  if (!match || !match[1]) return;

  const questionNumber = match[1];
  const formats = ["png", "jpg", "jpeg", "gif", "webp"];
  const currentIndex = formats.indexOf(currentFormat);

  // Thử định dạng tiếp theo
  if (currentIndex < formats.length - 1) {
    const nextFormat = formats[currentIndex + 1];
    const newSrc = `img/q${questionNumber}.${nextFormat}`;

    imageElement.onerror = function () {
      tryAlternativeImageFormats(imageElement, questionText, nextFormat);
    };

    imageElement.src = newSrc;
  } else {
    // Đã thử hết tất cả định dạng, ẩn container
    const container = imageElement.parentElement;
    if (container) {
      container.style.display = "none";
    }
  }
}

// Format câu hỏi với xuống dòng cho các ý
function formatQuestionText(text) {
  // Escape HTML để tránh XSS
  const escapeHtml = (str) => {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  };

  let formatted = escapeHtml(text);

  // Chuyển \n từ JSON thành <br> (sau khi escape, \n đã thành text)
  // Nhưng nếu có ký tự xuống dòng thật, cần convert
  formatted = formatted.replace(/\n/g, "<br>");

  // Xuống dòng trước các pattern:
  // i), ii), iii), iv), v) - chữ số La Mã với ngoặc đơn
  formatted = formatted.replace(
    /\s+(i{1,3}v?|i?[vx])\)\s*/gi,
    "<br><strong>$1)</strong> "
  );

  // i., ii., iii., iv., v. - chữ số La Mã với dấu chấm
  formatted = formatted.replace(
    /\s+(i{1,3}v?|i?[vx])\.\s+/gi,
    "<br><strong>$1.</strong> "
  );

  // a), b), c), d), e) - chữ cái thường trong ngoặc
  formatted = formatted.replace(
    /\s+([a-z])\)\s*/gi,
    "<br><strong>$1)</strong> "
  );

  // a., b., c., d., e. - chữ cái thường với dấu chấm
  formatted = formatted.replace(
    /\s+([a-z])\.\s+/g,
    "<br><strong>$1.</strong> "
  );

  // 1), 2), 3), 4), 5) - số
  formatted = formatted.replace(/\s+(\d+)\)\s*/g, "<br><strong>$1)</strong> ");

  // 1., 2., 3. - số với dấu chấm
  formatted = formatted.replace(/\s+(\d+)\.\s+/g, "<br><strong>$1.</strong> ");

  // A., B., C., D., E., F., G., ... Z. - chữ cái IN HOA với dấu chấm
  formatted = formatted.replace(
    /\s+([A-Z])\.\s+/g,
    "<br><strong>$1.</strong> "
  );

  // Loại bỏ <br> ở đầu nếu có
  formatted = formatted.replace(/^<br>/, "");

  // Loại bỏ nhiều <br> liên tiếp thành 1
  formatted = formatted.replace(/(<br>\s*){2,}/g, "<br>");

  return formatted;
}

// Hiển thị câu hỏi cho trang hiện tại
function renderQuiz() {
  const quizList = document.getElementById("quiz-list");
  quizList.innerHTML = "";

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, quizData.length);
  const currentQuestions = quizData.slice(startIndex, endIndex);

  currentQuestions.forEach((question, index) => {
    const questionIndex = startIndex + index;
    const questionCard = createQuestionCard(question, questionIndex);
    quizList.appendChild(questionCard);
  });

  updatePageInfo();
  scrollToTop();
}

// Create a question card element
function createQuestionCard(question, questionIndex) {
  const card = document.createElement("div");
  card.className = "card mb-3 question-card";
  card.id = `question-${questionIndex}`;

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";

  // Question text - định dạng với xuống dòng cho các ý
  const questionText = document.createElement("h5");
  questionText.className = "card-title question-text";

  // Format câu hỏi: tự động xuống dòng cho các ý i), ii), a), b), 1), 2), etc.
  const formattedQuestion = formatQuestionText(question["Câu"]);
  questionText.innerHTML = formattedQuestion;

  cardBody.appendChild(questionText);

  // Tự động tạo đường dẫn ảnh từ số câu hỏi
  const imagePath = getImagePathFromQuestion(question["Câu"]);

  // Hiển thị ảnh nếu có đường dẫn hoặc nguồn ảnh được chỉ định
  const imageSource = question["nguồn ảnh"] || imagePath;

  if (imageSource) {
    const imageContainer = document.createElement("div");
    imageContainer.className = "question-image-container mb-3";

    const image = document.createElement("img");
    image.src = imageSource;
    image.alt = "Hình ảnh câu hỏi";
    image.className = "question-image";
    image.onclick = function () {
      // Mở modal để xem ảnh phóng to
      openImageModal(image.src);
    };

    // Xử lý lỗi: nếu nguồn ảnh được chỉ định rõ thì chỉ ẩn,
    // nếu là tự động thì thử các định dạng khác
    if (question["nguồn ảnh"]) {
      // Nguồn ảnh được chỉ định rõ - chỉ ẩn nếu lỗi
      image.onerror = function () {
        imageContainer.style.display = "none";
      };
    } else {
      // Tự động tìm ảnh - thử các định dạng khác
      image.onerror = function () {
        tryAlternativeImageFormats(image, question["Câu"], "png");
      };
    }

    imageContainer.appendChild(image);
    cardBody.appendChild(imageContainer);
  }

  // Answer options
  const answersDiv = document.createElement("div");
  answersDiv.className = "answers mt-3";

  question["các đáp án"].forEach((answer, answerIndex) => {
    const answerOption = createAnswerOption(
      answer,
      questionIndex,
      answerIndex,
      question["đáp án đúng"]
    );
    answersDiv.appendChild(answerOption);
  });

  cardBody.appendChild(answersDiv);

  // Feedback area
  const feedbackDiv = document.createElement("div");
  feedbackDiv.className = "feedback mt-3";
  feedbackDiv.id = `feedback-${questionIndex}`;
  cardBody.appendChild(feedbackDiv);

  card.appendChild(cardBody);

  // Restore previous answer if exists
  if (userAnswers[questionIndex] !== undefined) {
    setTimeout(() => {
      const radio = document.querySelector(
        `input[name="question-${questionIndex}"][value="${userAnswers[questionIndex]}"]`
      );
      if (radio) {
        radio.checked = true;
        showFeedback(
          questionIndex,
          userAnswers[questionIndex],
          question["đáp án đúng"]
        );
      }
    }, 0);
  }

  return card;
}

// Tạo tùy chọn đáp án (radio button)
function createAnswerOption(answer, questionIndex, answerIndex, correctAnswer) {
  const div = document.createElement("div");
  div.className = "form-check answer-option";

  const input = document.createElement("input");
  input.className = "form-check-input";
  input.type = "radio";
  input.name = `question-${questionIndex}`;
  input.id = `q${questionIndex}-a${answerIndex}`;
  input.value = answerIndex;

  const label = document.createElement("label");
  label.className = "form-check-label";
  label.htmlFor = `q${questionIndex}-a${answerIndex}`;
  label.textContent = answer;

  // Thêm sự kiện lắng nghe để phản hồi ngay lập tức
  input.addEventListener("change", () => {
    handleAnswerSelection(questionIndex, answerIndex, correctAnswer);
  });

  div.appendChild(input);
  div.appendChild(label);

  return div;
}

// Xử lý khi chọn đáp án
function handleAnswerSelection(questionIndex, selectedAnswer, correctAnswer) {
  // Lưu câu trả lời của người dùng
  userAnswers[questionIndex] = selectedAnswer;

  // Hiển thị phản hồi
  showFeedback(questionIndex, selectedAnswer, correctAnswer);
}

// Hiển thị phản hồi cho đáp án đã chọn
function showFeedback(questionIndex, selectedAnswer, correctAnswer) {
  const feedbackDiv = document.getElementById(`feedback-${questionIndex}`);
  const questionCard = document.getElementById(`question-${questionIndex}`);

  // Lấy nội dung đáp án đã chọn
  const selectedAnswerText =
    quizData[questionIndex]["các đáp án"][selectedAnswer];

  // Kiểm tra đáp án có đúng không
  const isCorrect = correctAnswer.startsWith(selectedAnswerText.charAt(0));

  // Cập nhật style cho tất cả các tùy chọn đáp án
  const answerOptions = questionCard.querySelectorAll(".answer-option");
  answerOptions.forEach((option, index) => {
    option.classList.remove("correct-answer", "wrong-answer");

    const answerText = quizData[questionIndex]["các đáp án"][index];
    const isThisCorrect = correctAnswer.startsWith(answerText.charAt(0));

    if (index === selectedAnswer) {
      if (isCorrect) {
        option.classList.add("correct-answer");
      } else {
        option.classList.add("wrong-answer");
      }
    } else if (!isCorrect && isThisCorrect) {
      // Làm nổi bật đáp án đúng nếu người dùng chọn sai
      option.classList.add("correct-answer");
    }
  });

  // Hiển thị thông báo phản hồi
  if (isCorrect) {
    feedbackDiv.innerHTML = `
            <div class="alert alert-success">
                <strong>✓ Đúng!</strong>
                <p class="mb-0 mt-2"><strong>Giải thích:</strong> ${correctAnswer}</p>
            </div>
        `;
  } else {
    feedbackDiv.innerHTML = `
            <div class="alert alert-danger">
                <strong>✗ Sai!</strong>
                <p class="mb-0 mt-2"><strong>Đáp án đúng:</strong> ${correctAnswer}</p>
            </div>
        `;
  }
}

// Hiển thị điều khiển phân trang
function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(quizData.length / ITEMS_PER_PAGE);

  // Previous button
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  const prevLink = document.createElement("a");
  prevLink.className = "page-link";
  prevLink.href = "#";
  prevLink.textContent = "« Trước";
  prevLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      renderQuiz();
      renderPagination();
      updateURL();
    }
  });
  prevLi.appendChild(prevLink);
  pagination.appendChild(prevLi);

  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    addPageButton(pagination, 1);
    if (startPage > 2) {
      const ellipsis = document.createElement("li");
      ellipsis.className = "page-item disabled";
      ellipsis.innerHTML = '<span class="page-link">...</span>';
      pagination.appendChild(ellipsis);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    addPageButton(pagination, i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const ellipsis = document.createElement("li");
      ellipsis.className = "page-item disabled";
      ellipsis.innerHTML = '<span class="page-link">...</span>';
      pagination.appendChild(ellipsis);
    }
    addPageButton(pagination, totalPages);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${
    currentPage === totalPages ? "disabled" : ""
  }`;
  const nextLink = document.createElement("a");
  nextLink.className = "page-link";
  nextLink.href = "#";
  nextLink.textContent = "Sau »";
  nextLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      renderQuiz();
      renderPagination();
      updateURL();
    }
  });
  nextLi.appendChild(nextLink);
  pagination.appendChild(nextLi);
}

// Add a page number button
function addPageButton(pagination, pageNum) {
  const li = document.createElement("li");
  li.className = `page-item ${currentPage === pageNum ? "active" : ""}`;
  const link = document.createElement("a");
  link.className = "page-link";
  link.href = "#";
  link.textContent = pageNum;
  link.addEventListener("click", (e) => {
    e.preventDefault();
    currentPage = pageNum;
    renderQuiz();
    renderPagination();
    updateURL();
  });
  li.appendChild(link);
  pagination.appendChild(li);
}

// Update page info
function updatePageInfo() {
  const pageInfo = document.getElementById("page-info");
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, quizData.length);
  const totalPages = Math.ceil(quizData.length / ITEMS_PER_PAGE);

  pageInfo.textContent = `Trang ${currentPage} / ${totalPages} (Câu ${startIndex}-${endIndex} / ${quizData.length})`;
}

// Scroll to top when changing pages
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Mở modal để xem ảnh phóng to
function openImageModal(imageSrc) {
  // Tạo modal nếu chưa tồn tại
  let modal = document.getElementById("image-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "image-modal";
    modal.className = "image-modal";

    const closeBtn = document.createElement("span");
    closeBtn.className = "image-modal-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.onclick = function () {
      closeImageModal();
    };

    const modalImg = document.createElement("img");
    modalImg.id = "modal-image";

    modal.appendChild(closeBtn);
    modal.appendChild(modalImg);
    document.body.appendChild(modal);

    // Đóng modal khi click vào nền
    modal.onclick = function (e) {
      if (e.target === modal) {
        closeImageModal();
      }
    };

    // Đóng modal khi nhấn ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeImageModal();
      }
    });
  }

  // Hiển thị ảnh trong modal
  const modalImg = document.getElementById("modal-image");
  modalImg.src = imageSrc;
  modal.classList.add("show");
  document.body.style.overflow = "hidden"; // Không cho scroll trang khi modal mở
}

// Đóng modal ảnh
function closeImageModal() {
  const modal = document.getElementById("image-modal");
  if (modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "auto"; // Cho phép scroll lại
  }
}
