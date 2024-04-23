
  /* Визуальные эффекты кнопки */
export const btnClickHandler = (btn) => {
    btn.style.filter = "brightness(1.7)";
    setTimeout(() => {
      btn.style.filter = "brightness(1)";
    }, 300);
    
}
