class Game {
  constructor() {
    this.state = {
      score: 0,
      boxGroup: {},
      isMoving: false
    };
    this.init();
  }
  init() {
    this.gerneratorNum();
    this.bindEvent();
  }
  addScore(num) {
    this.state.score += num;
    document.querySelector('.score').innerText = this.state.score;
  }
  addBox(posX, num) {
    const dom = document.querySelector(`.content .box:nth-child(${posX + 1})`);
    dom.innerText = num;
    if (num) {
      let n;
      if (num < 17) {
        n = num;
      } else {
        n = 16;
      }
      dom.style.color = `var(--color-${n})`;
      dom.style.background = `var(--bg-${n})`;
    } else {
      dom.style.color = '';
      dom.style.background = '';
    }
  }
  gerneratorNum() {
    const { boxGroup } = this.state;
    const have = Object.keys(boxGroup).length;

    const list = [
      [0, 8],
      [0.2, 4],
      [0.5, 2]
    ];
    const n = Math.random() * 1;
    const num =
      have > 0
        ? list.find(
            (item, i) =>
              n >= item[0] && (i == list.length - 1 || n < list[i + 1][0])
          )[1]
        : 2;
    const posX = Math.floor(Math.random() * (16 - have));
    let arr = [];
    for (let m = 0; m < 16; m++) {
      if (!boxGroup[m]) {
        arr.push(m);
      }
    }
    boxGroup[arr[posX]] = num;
    this.addBox(arr[posX], num);
  }
  mergeBox(direction) {
    const { boxGroup } = this.state;
    let { isMoving } = this.state;
    if (isMoving) {
      return;
    }
    isMoving = true;
    let isChange = false;
    let score = 0;
    switch (direction) {
      case 'left': {
        for (let f = 0; f < 4; f++) {
          const n = f * 4;
          const prev = {};
          prev[n] = boxGroup[n];
          prev[n + 1] = boxGroup[n + 1];
          prev[n + 2] = boxGroup[n + 2];
          prev[n + 3] = boxGroup[n + 3];
          let arr = [];
          let start = n;
          while (start < n + 4) {
            const num = boxGroup[start];
            if (num) {
              let s = num;
              let m = start + 1;
              let j = n + 4;
              start += 1;
              for (let p = m; p < j; p++) {
                if (boxGroup[p]) {
                  if (boxGroup[p] == num) {
                    s = boxGroup[p] * 2;
                    start = p + 1;
                    score += boxGroup[p];
                  } else {
                    start = p;
                  }
                  break;
                }
              }
              arr.push(s);
            } else {
              start += 1;
            }
          }
          if (
            arr.length !=
            Object.keys(prev).filter((item) => !!prev[item]).length
          ) {
            isChange = true;
          }
          for (let p = 0; p < 4; p++) {
            if (arr[p]) {
              this.addBox(n + p, arr[p]);
              boxGroup[n + p] = arr[p];
              if (prev[n + p] != arr[p]) {
                isChange = true;
              }
            } else {
              if (boxGroup[n + p]) {
                isChange = true;
              }
              this.addBox(n + p, '');
              delete boxGroup[n + p];
            }
          }
        }
        break;
      }
      case 'right': {
        for (let f = 0; f < 4; f++) {
          const n = f * 4;
          const prev = {};
          prev[n] = boxGroup[n];
          prev[n + 1] = boxGroup[n + 1];
          prev[n + 2] = boxGroup[n + 2];
          prev[n + 3] = boxGroup[n + 3];
          let arr = [];
          let start = n + 3;
          while (start > n - 1) {
            const num = boxGroup[start];
            if (num) {
              let s = num;
              let m = n;
              let j = start - 1;
              start -= 1;
              for (let p = j; p >= m; p--) {
                if (boxGroup[p]) {
                  if (boxGroup[p] == num) {
                    s = boxGroup[p] * 2;
                    start = p - 1;
                    score += boxGroup[p];
                  } else {
                    start = p;
                  }
                  break;
                }
              }
              arr.push(s);
            } else {
              start -= 1;
            }
          }
          if (
            arr.length !=
            Object.keys(prev).filter((item) => !!prev[item]).length
          ) {
            isChange = true;
          }
          for (let p = 0; p < 4; p++) {
            if (arr[p]) {
              boxGroup[n + 3 - p] = arr[p];
              this.addBox(n + 3 - p, arr[p]);
              if (prev[n + 3 - p] != arr[p]) {
                isChange = true;
              }
            } else {
              if (boxGroup[n + 3 - p]) {
                isChange = true;
              }
              this.addBox(n + 3 - p, '');
              delete boxGroup[n + 3 - p];
            }
          }
        }
        break;
      }
      case 'top': {
        for (let n = 0; n < 4; n++) {
          const prev = {};
          prev[n] = boxGroup[n];
          prev[n + 4] = boxGroup[n + 4];
          prev[n + 8] = boxGroup[n + 8];
          prev[n + 12] = boxGroup[n + 12];
          let arr = [];
          let start = 0;
          while (start < 4) {
            const num = boxGroup[n + start * 4];
            if (num) {
              let s = num;
              let m = start + 1;
              let j = 4;
              start += 1;
              for (let p = m; p <= j; p++) {
                let num2 = boxGroup[n + p * 4];
                if (num2) {
                  if (num2 == num) {
                    s = num2 * 2;
                    start = p + 1;
                    score += num2;
                  } else {
                    start = p;
                  }
                  break;
                }
              }
              arr.push(s);
            } else {
              start += 1;
            }
          }

          if (
            arr.length !=
            Object.keys(prev).filter((item) => !!prev[item]).length
          ) {
            isChange = true;
          }
          for (let p = 0; p < 4; p++) {
            if (arr[p]) {
              boxGroup[n + p * 4] = arr[p];
              this.addBox(n + p * 4, arr[p]);
              if (prev[n + p * 4] != arr[p]) {
                isChange = true;
              }
            } else {
              if (boxGroup[n + p * 4]) {
                isChange = true;
              }
              this.addBox(n + p * 4, '');
              delete boxGroup[n + p * 4];
            }
          }
        }
        break;
      }
      case 'bottom': {
        for (let n = 0; n < 4; n++) {
          let arr = [];
          let start = 3;
          const prev = {};
          prev[n] = boxGroup[n];
          prev[n + 4] = boxGroup[n + 4];
          prev[n + 8] = boxGroup[n + 8];
          prev[n + 12] = boxGroup[n + 12];
          while (start >= 0) {
            const num = boxGroup[n + start * 4];
            if (num) {
              let s = num;
              let m = 0;
              let j = start - 1;
              start -= 1;
              for (let p = m; p <= j; p++) {
                let num2 = boxGroup[n + (j - p) * 4];
                if (num2) {
                  if (num2 == num) {
                    s = num2 * 2;
                    start = j - p - 1;
                    score += num2;
                  } else {
                    start = j - p;
                  }
                  break;
                }
              }
              arr.push(s);
            } else {
              start -= 1;
            }
          }
          if (
            arr.length !=
            Object.keys(prev).filter((item) => !!prev[item]).length
          ) {
            isChange = true;
          }
          for (let p = 0; p < 4; p++) {
            if (arr[p]) {
              boxGroup[n + (3 - p) * 4] = arr[p];
              this.addBox(n + (3 - p) * 4, arr[p]);
              if (prev[n + (3 - p) * 4] != arr[p]) {
                isChange = true;
              }
            } else {
              if (boxGroup[n + (3 - p) * 4]) {
                isChange = true;
              }
              this.addBox(n + (3 - p) * 4, '');
              delete boxGroup[n + (3 - p) * 4];
            }
          }
        }
        break;
      }
    }
    if (isChange) {
      this.addScore(score);
      this.gerneratorNum();
    }
    isMoving = false;
  }
  bindEvent() {
    const dom = document.querySelector('.content');
    dom.ontouchstart = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { clientX: startX, clientY: startY } = e.touches[0];
      dom.ontouchmove = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { clientX: endX, clientY: endY } = e.touches[0];
        dom.ontouchend = (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (Math.abs(endY - startY) < 10) {
            if (endX - startX > 20) {
              // 右滑
              this.mergeBox('right');
            }
            if (endX - startX < -20) {
              // 左滑
              this.mergeBox('left');
            }
          }

          if (Math.abs(endX - startX) < 10) {
            if (endY - startY > 20) {
              // 下滑
              this.mergeBox('bottom');
            }
            if (endY - startY < -20) {
              // 上滑
              this.mergeBox('top');
            }
          }
          document.ontouchmove = () => {};
          document.ontouchend = () => {};
        };
      };
    };
  }
}
const game = new Game();
