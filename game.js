Panel.initialize("#000015");

var gamePanel = function() {
  var gamePanel = new Panel(undefined, Panel.Rectangle);
  gamePanel.onresize = function() {
    this.setLocation(new Vector());
    this.setSize(new Vector(
      (Panel.container.size.X < 200) ? 200 : Panel.container.size.X,
      (Panel.container.size.Y < 250) ? 250 : Panel.container.size.Y));
  };
  gamePanel.onresize();

  gamePanel.topPanel = function() {
    var topPanel = new Panel(gamePanel, Panel.Rectangle);
    topPanel.onresize = function() {
      this.setLocation(new Vector());
      this.setSize(new Vector(gamePanel.size.X, 50));
    };
    topPanel.onresize();

    topPanel.onmousedown = function(event) {
      this.parent.onmousedown(event);
    };
    topPanel.onmousemove = function(event) {
      this.parent.onmousemove(event);
    };
    topPanel.onmouseout = function(event) {
      this.parent.onmouseout(event);
    };
    topPanel.onmouseup = function(event) {
      this.parent.onmouseup(event);
    };

    topPanel.pauseButton = function() {
      var pauseButton = new Panel(topPanel, Panel.Rectangle);
      pauseButton.onresize = function() {
        this.setLocation(new Vector(10, 13));
        this.setSize(new Vector(21, 24));
      };
      pauseButton.onresize();

      pauseButton.color = "white";

      pauseButton.onpaint = function() {
        Panel.ctx.strokeStyle = this.color;
        Panel.ctx.lineWidth = 8;

        Panel.ctx.beginPath();
        Panel.ctx.moveTo(4, 0);
        Panel.ctx.lineTo(4, this.size.Y);
        Panel.ctx.stroke();

        Panel.ctx.beginPath();
        Panel.ctx.moveTo(this.size.X - 4, 0);
        Panel.ctx.lineTo(this.size.X - 4, this.size.Y);
        Panel.ctx.stroke();


      };

      pauseButton.onmousedown = function() {
        this.color = "grey";
        this.selected = true
      };

      pauseButton.onmouseover = function() {
        this.color = "#AAA";
      };

      pauseButton.onmouseout = function() {
        this.selected = false;
        this.color = this.baseColor || "white";
      };

      pauseButton.onmouseup = function() {

        if (!this.selected) return;

        gamePanel.pauseDark = function() {
          pauseButton.timeMousedown = Date.now();
          gamePanel.stopAnimation();

          var pauseDark = new Panel(gamePanel, Panel.Rectangle, null, null, "rgba(0, 0, 0, 0.9)");
          pauseDark.onresize = function() {
            this.setLocation(new Vector(0, 0));
            this.setSize(this.parent.getSize());
          };
          pauseDark.onresize();

          pauseDark.pausePanel = function() {
            var pausePanel = new Panel(pauseDark, Panel.Rectangle);
            pausePanel.onresize = function() {
              var parentCenter = this.parent.getCenter();
              this.setLocation(parentCenter.subtract(new Vector(100, 75)));
              this.setSize(new Vector(200, 150));
            };
            pausePanel.onresize();

            pausePanel.setToClip(false);
            pausePanel.setFillStyle("rgba(20, 20, 100, 0.5)");
            pausePanel.setStrokeStyle("rgba(255, 255, 255, 0.5)", 5);

            pausePanel.infoString = function() {
              infoString = new Panel(pausePanel, Panel.Rectangle);
              infoString.onresize = function() {
                this.setLocation(new Vector(5, 0));
                this.setSize(new Vector(this.parent.getSize().X - this.parent.getLocation().X - 10, 100 - 10));
              };
              infoString.onresize();

              infoString.setString("PAUSE", "white", true);

              return infoString;
            }();

            pausePanel.resumeButton = function() {
              resumeButton = new Panel(pausePanel, Panel.Rectangle);
              resumeButton.onresize = function() {
                this.setLocation(new Vector(105, 85));
                this.setSize(new Vector(85, 50));
              };
              resumeButton.onresize();

              resumeButton.setToClip(false);
              resumeButton.setFillStyle("black");
              resumeButton.setStrokeStyle("white", 5);

              resumeButton.onmousedown = function() {
                this.setFillStyle("#333");
                this.invalidate();

                this.selected = true
              };

              resumeButton.onmouseover = function() {
                this.setFillStyle("#222");
                this.invalidate();
              };

              resumeButton.onmouseout = function() {
                this.selected = false;
                this.setFillStyle("black");
                this.invalidate();
              };

              resumeButton.onmouseup = function() {
                if (!this.selected) return;

                pauseDark.parent.removePanel(pauseDark);
                gamePanel.timerPanel.timeStart += (Date.now() - pauseButton.timeMousedown);
                gamePanel.startAnimationPhysics();
              };

              resumeButton.onpaint = function() {
                Panel.ctx.beginPath();
                Panel.ctx.lineWidth = 3;
                Panel.ctx.strokeStyle = "white";
                Panel.ctx.moveTo(32, 15);
                Panel.ctx.lineTo(32, 35);
                Panel.ctx.lineTo(53, 25);
                Panel.ctx.lineTo(32, 15);
                Panel.ctx.lineTo(32, 35);
                Panel.ctx.stroke();
              };

              return resumeButton;
            }();

            pausePanel.restartButton = function() {
              restartButton = new Panel(pausePanel, Panel.Rectangle);
              restartButton.onresize = function() {
                this.setLocation(new Vector(10, 85));
                this.setSize(new Vector((this.parent.getSize().X - this.parent.getLocation().X) / 2 - 15, 50));
              };
              restartButton.onresize();

              restartButton.setToClip(false);
              restartButton.setFillStyle("black");
              restartButton.setStrokeStyle("white", 5);


              restartButton.onmousedown = function() {
                this.setFillStyle("#333");
                this.invalidate();

                this.selected = true
              };

              restartButton.onmouseover = function() {
                this.setFillStyle("#222");
                this.invalidate();
              };

              restartButton.onmouseout = function() {
                this.selected = false;
                this.setFillStyle("black");
                this.invalidate();
              };

              restartButton.onmouseup = function() {
                if (!this.selected) return;

                pauseDark.parent.removePanel(pauseDark);
                gamePanel.elementGrid.newGame();
                gamePanel.startAnimationPhysics();
              };

              restartButton.onpaint = function() {
                Panel.ctx.beginPath();
                Panel.ctx.strokeStyle = "white";
                Panel.ctx.lineWidth = 3;
                Panel.ctx.arc(this.center.X, this.center.Y, 12, 0.2, Math.PI * 11 / 6);
                Panel.ctx.lineTo(49, 19);
                Panel.ctx.lineTo(54, 15);
                Panel.ctx.lineTo(54, 19);
                Panel.ctx.lineTo(49, 19);
                Panel.ctx.stroke();
              };

              return restartButton;
            }();

            return pausePanel;
          }();

          pauseDark.invalidate();
          return pauseDark;
        }();
      };

      return pauseButton;
    }();
    topPanel.scorePanel = function() {
      var scorePanel = new Panel(topPanel, Panel.Rectangle);
      scorePanel.onresize = function() {
        this.setLocation(new Vector(50, 0));
        this.setSize(new Vector(topPanel.size.X - 100, topPanel.size.Y));
      };
      scorePanel.onresize();

      scorePanel.setIgnoremouse(true);

      scorePanel.throwsNumber = 0;

      scorePanel.setString("0", "white", true, 30);

      scorePanel.increaseScore = function() {
        scorePanel.throwsNumber++;
        topPanel.recordPanel.recordPanelBottom.checkRecord(scorePanel.throwsNumber);
        scorePanel.setString(scorePanel.throwsNumber, null, true, 30);
      };
      scorePanel.resetScore = function() {
        scorePanel.throwsNumber = 0;
        scorePanel.setString("0", null, true, 30);
      };

      return scorePanel;
    }();
    topPanel.recordPanel = function() {
      var recordPanel = new Panel(topPanel, Panel.Rectangle);
      recordPanel.onresize = function() {
        this.setLocation(new Vector(topPanel.size.X - 50, 0));
        this.setSize(new Vector(50, topPanel.size.Y));
      };
      recordPanel.onresize();

      recordPanel.recordPanelTop = function() {
        var recordPanelTop = new Panel(recordPanel, Panel.Rectangle);
        recordPanelTop.onresize = function() {
          this.setLocation(new Vector());
          this.setSize(new Vector(50, recordPanel.size.Y / 2 + 10));
        };
        recordPanelTop.onresize();

        recordPanelTop.setString("TOP", "white", true, 12);

        return recordPanelTop;
      }();
      recordPanel.recordPanelBottom = function() {
        var recordPanelBottom = new Panel(recordPanel, Panel.Rectangle);
        recordPanelBottom.onresize = function() {
          this.setLocation(new Vector(0, recordPanel.size.Y / 2 - 5));
          this.setSize(new Vector(50, recordPanel.size.Y / 2));
        };
        recordPanelBottom.onresize();

        recordPanelBottom.record = Cookie.read("record") || "0";

        recordPanelBottom.setString(recordPanelBottom.record, "white", true, 15);

        recordPanelBottom.checkRecord = function(score) {
          if (score > recordPanelBottom.record) {
            recordPanelBottom.record = score;
            Cookie.write("record", score, 3600);
            recordPanelBottom.newRecord = score;
          }
          recordPanelBottom.setString(recordPanelBottom.record, null, true, 15);
        };

        return recordPanelBottom;
      }();

      recordPanel.setIgnoremouse(true);
      return recordPanel;
    }();

    return topPanel;
  }();
  gamePanel.middlePanel = function() {
    middlePanel = new Panel(gamePanel, Panel.Rectangle);
    middlePanel.onresize = function() {
      if (gamePanel.size.X < gamePanel.size.Y - 100) {
        gamePanel.playgroundSize = gamePanel.size.X;
      } else {
        gamePanel.playgroundSize = gamePanel.size.Y - 100;
      }
      gamePanel.playgroundSizeDifference = (gamePanel.size.X - gamePanel.playgroundSize) / 2;
      this.setLocation(new Vector(0, gamePanel.topPanel.getSize().Y));
      this.setSize(new Vector(gamePanel.size.X, gamePanel.playgroundSize + 6));
    };
    middlePanel.onresize();

    middlePanel.separatorTop = function() {
      var separatorTop = new Panel(middlePanel, Panel.Rectangle, null, null, "white");
      separatorTop.onresize = function() {
        this.setLocation(new Vector());
        this.setSize(new Vector(gamePanel.size.X, 3));
      };
      separatorTop.onresize();

      return separatorTop;
    }();
    middlePanel.separatorLeftPlayground = function() {
      var separatorLeftPlayground = new Panel(middlePanel, Panel.Rectangle, null, null, "white");
      separatorLeftPlayground.onresize = function() {
        this.setLocation(new Vector(gamePanel.playgroundSizeDifference - 3, 3));
        this.setSize(new Vector(3, gamePanel.playgroundSize));
      };
      separatorLeftPlayground.onresize();

      return separatorLeftPlayground;
    }();
    middlePanel.separatorRightPlayground = function() {
      var separatorRightPlayground = new Panel(middlePanel, Panel.Rectangle, null, null, "white");
      separatorRightPlayground.onresize = function() {
        this.setLocation(new Vector(gamePanel.playgroundSize + gamePanel.playgroundSizeDifference, 3));
        this.setSize(new Vector(3, gamePanel.playgroundSize));
      };
      separatorRightPlayground.onresize();

      return separatorRightPlayground;
    }();
    middlePanel.playground = function() {
      var playground = new Panel(middlePanel, Panel.Rectangle);
      playground.onresize = function() {
        this.transform.resetMatrix();
        this.setLocation(new Vector(0, 3));
        this.setSize(new Vector(364, 364));
        if (gamePanel.playgroundSizeDifference)
          this.translate(new Vector(gamePanel.playgroundSizeDifference, 0));
        this.scaleOrigin(gamePanel.playgroundSize / playground.size.X);
      };
      playground.onresize();
      playground.friction = -0.000099;

      playground.gameBall = function() {
        var gameBallRadius = 8;
        var gameBall = new Panel(playground, Panel.Circle, null, gameBallRadius * 2, "rgba(255, 255, 255, 1)");

        gameBall.startPosition = function() {
          this.setLocation(new Vector(playground.size.X / 2 - gameBallRadius, playground.size.Y - gameBallRadius * 3));
        };
        gameBall.startPosition();

        gameBall.acceleration = playground.friction;
        gameBall.free = true;
        gameBall.bonusBalls = [];
        gameBall.addCheckCollision(gameBall.parent);
        gameBall.addCheckCollision(gameBall);

        gameBall.ontick = function() {
          if (!this.free) {
            gameBall.inMovement = gameBall.speed.X || gameBall.speed.Y;
            if (!gameBall.inMovement) {
              if (gameBall.bonusBalls.length) {
                gameBall.bonusBalls.forEach(function(ball, index, object) {
                  if (ball.speed.X == 0 && ball.speed.Y == 0)
                    object.splice(index, 1);
                });
              } else {
                gameBall.bonusBalls = [];
                gameBall.free = true;
                gamePanel.elementGrid.nextTurn();
              }
            }
          }
        };

        gameBall.onresize = function() {
          gamePanel.directionBallsRadius = (gameBallRadius / 2) * gamePanel.playgroundSize / playground.size.X;
        };
        gameBall.onresize();

        return gameBall;
      }();
      return playground;
    }();
    middlePanel.separatorBottomPlayground = function() {
      var separatorBottomPlayground = new Panel(middlePanel, Panel.Rectangle, null, null, "white");
      separatorBottomPlayground.onresize = function() {
        this.setLocation(new Vector(0, gamePanel.playgroundSize + 3));
        this.setSize(new Vector(gamePanel.size.X, 3));
      };
      separatorBottomPlayground.onresize();

      return separatorBottomPlayground;
    }();

    middlePanel.setIgnoremouse(true);
    return middlePanel;
  }();
  gamePanel.bottomPanel = function() {
    var bottomPanel = new Panel(gamePanel, Panel.Rectangle);
    bottomPanel.onresize = function() {
      this.setLocation(new Vector(0, middlePanel.getSize().Y));
      this.setSize(new Vector(gamePanel.size.X, (gamePanel.size.Y - gamePanel.playgroundSize - 100 - 3)));
    };
    bottomPanel.onresize();

    bottomPanel.setIgnoremouse(true);
    return bottomPanel;
  }();
  gamePanel.timerPanel = function() {
    timerPanel = new Panel(gamePanel, Panel.Rectangle);
    timerPanel.onresize = function() {
      this.setLocation(new Vector(0, gamePanel.bottomPanel.getSize().Y));
      this.setSize(new Vector(gamePanel.size.X, 47));
    };
    timerPanel.onresize();

    timerPanel.setStrokeStyle("white", 6);
    timerPanel.setString("30:00", "white", true, 30);

    timerPanel.start = function() {
      this.running = true;

      this.timeStart = Date.now();
      this.gameTime = 30 * 60;
      this.timeLeft = timerPanel.gameTime;
    };

    timerPanel.reset = function() {
      this.running = false;
      timerPanel.setString("30:00", timerPanel.color, true, 30);
    };

    timerPanel.ontick = function() {
      if (!this.running) return;
      var time = Math.floor(this.gameTime - ((Date.now() - this.timeStart) / 1000));

      if (time < this.timeLeft) {
        if (time <= 0) {
          this.running = false;
          gamePanel.gameOver();
        }
        this.timeLeft = time;
        var minutes = Math.floor(time / 60);
        var seconds = Math.floor(time % 60);
        var red = Math.floor(Math.random() * 255);
        var green = Math.floor(Math.random() * 255);
        var blue = Math.floor(Math.random() * 255);
        if (red < 150 && green < 150 && blue < 200) {
          red += 150;
          green += 150;
          blue += 200;
        }
        var color = "rgba(" + red + ", " + green + ", " + blue + ", 1)"
        this.setString(((minutes < 10) ? "0" : "") + minutes + ":" + ((seconds < 10) ? "0" : "") + seconds, color, true, 30);
        if (this.minute != minutes) {
          this.setStrokeStyle(color, 6);
          gamePanel.middlePanel.separatorTop.setFillStyle(color);
          gamePanel.middlePanel.separatorLeftPlayground.setFillStyle(color);
          gamePanel.middlePanel.separatorRightPlayground.setFillStyle(color);
          gamePanel.middlePanel.separatorBottomPlayground.setFillStyle(color);

          gamePanel.timerPanel.color = color;
          gamePanel.topPanel.pauseButton.color = color;
          gamePanel.topPanel.pauseButton.baseColor = color;
          gamePanel.topPanel.scorePanel.setFontStyle(color);
          gamePanel.topPanel.recordPanel.recordPanelBottom.setFontStyle(color);
          gamePanel.topPanel.recordPanel.recordPanelTop.setFontStyle(color);

          this.minute = minutes;
        }
      }
    };

    timerPanel.setIgnoremouse(true);

    return timerPanel;
  }();


  var startDragCircle = function() {
    var startDragCircle = new Panel(undefined, Panel.Circle, new Vector(), 64);
    startDragCircle.setIgnoremouse(true);
    startDragCircle.setFillStyle();
    startDragCircle.setStrokeStyle("rgba(255, 255, 255, 0.2)", 10);
    startDragCircle.tempBall = new Panel(startDragCircle, Panel.Circle,
      new Vector(startDragCircle.size.X / 2 - 23, startDragCircle.size.Y / 2 - 23),
      46, "rgba(255, 255, 255, 0.3)");
    return startDragCircle;
  }();
  gamePanel.directionBalls = function() {
    var playground = this.middlePanel.playground;
    var directionBalls = [];
    for (var i = 0; i < 12; i++) {
      directionBalls[i] = new Panel(undefined, Panel.Circle, new Vector(), null, "rgba(255, 255, 255, 0.6)");
      directionBalls[i].position = i + 1;

      directionBalls[i].newDirection = function() {
        var ballPoint = playground.parent.transform.transformPoint(playground.transform.transformPoint(playground.gameBall.getCenter()));
        this.setSize(gamePanel.directionBallsRadius * 2);
        var distance = gamePanel.directionBallsRadius * 7 * this.position;

        this.setLocation(
          new Vector(
            ballPoint.X - gamePanel.directionBallsRadius - distance * playground.direction.X,
            ballPoint.Y - gamePanel.directionBallsRadius - distance * playground.direction.Y));
      };
      directionBalls[i].setIgnoremouse(true);
    }

    return directionBalls;
  }();
  gamePanel.onmousedown = function(event) {
    if (this.selected || !this.middlePanel.playground.gameBall.free) return;
    startDragCircle.setLocation(new Vector(event.offsetX - 32, event.offsetY - 32));
    this.addPanel(startDragCircle);
    this.selected = true;
    this.mousedownPoint = new Vector(event.offsetX, event.offsetY);
  };
  gamePanel.onmousemove = function(event) {
    var playground = this.middlePanel.playground;
    if (this.selected) {

      playground.direction = new Vector(event.offsetX - this.mousedownPoint.X, event.offsetY - this.mousedownPoint.Y);
      var distance = playground.direction.magnitude();

      if (distance > startDragCircle.radius) {
        playground.direction = playground.direction.normalize();

        this.directionBalls.forEach(function(ball) {
          ball.newDirection();
          gamePanel.addPanel(ball);
        });


      } else {
        this.directionBalls.forEach(function(ball) {
          gamePanel.removePanel(ball);
        });
        playground.direction = null;
      }
    }
  };
  gamePanel.onmouseup = function(event) {
    if (this.selected) {
      var playground = this.middlePanel.playground;

      if (playground.direction) {

        if (!gamePanel.timerPanel.running) gamePanel.timerPanel.start();

        playground.gameBall.speed = playground.direction.multiply(-0.7);
        playground.direction = null;
        playground.gameBall.free = false;
      } else {
        playground.gameBall.speed.set(0, 0);
      }
    }
  };
  gamePanel.onmouseout = function() {
    if (this.selected) {
      var playground = this.middlePanel.playground;
      this.selected = false;
      this.removePanel(startDragCircle);

      this.directionBalls.forEach(function(ball) {
        gamePanel.removePanel(ball);
      });
    }
  };

  gamePanel.gameOver = function() {

    gamePanel.gameOverDark = function() {
      gamePanel.stopAnimation();

      var gameOverDark = new Panel(gamePanel, Panel.Rectangle, null, null, "rgba(0, 0, 0, 0.9)");
      gameOverDark.onresize = function() {
        this.setLocation(new Vector(0, 0));
        this.setSize(this.parent.getSize());
      };
      gameOverDark.onresize();

      var newRecord = gamePanel.topPanel.recordPanel.recordPanelBottom.newRecord;

      gameOverDark.gameOverPanel = function() {
        var gameOverPanel = new Panel(gameOverDark, Panel.Rectangle);
        gameOverPanel.onresize = function() {
          var parentCenter = this.parent.getCenter();
          this.setLocation(parentCenter.subtract(new Vector(100, (newRecord) ? 100 : 75)));
          this.setSize(new Vector(200, (newRecord) ? 200 : 150));
        };
        gameOverPanel.onresize();

        gameOverPanel.setToClip(false);
        gameOverPanel.setFillStyle("rgba(50, 20, 20, 0.5)");
        gameOverPanel.setStrokeStyle("rgba(255, 255, 255, 0.5)", 5);


        gameOverPanel.infoString = function() {
          infoString = new Panel(gameOverPanel, Panel.Rectangle);
          infoString.onresize = function() {
            this.setLocation(new Vector(5, 0));
            this.setSize(new Vector(this.parent.getSize().X - this.parent.getLocation().X - 10, 100 - 10));
          };
          infoString.onresize();

          infoString.setString("GAME OVER", "#D00", true);

          return infoString;
        }();

        if (newRecord) {
          gamePanel.topPanel.recordPanel.recordPanelBottom.newRecord = false;

          gameOverPanel.newRecordLabel = function() {
            var newRecord = new Panel(gameOverPanel, Panel.Rectangle);
            newRecord.onresize = function() {
              this.setLocation(new Vector(0, 55));
              this.setSize(new Vector(this.parent.size.X, 40));
            };
            newRecord.onresize();

            newRecord.setString("NEW RECORD", "#3D3", true);

            return newRecord;
          }();

          gameOverPanel.newRecordScore = function() {
            var newRecordScore = new Panel(gameOverPanel, Panel.Rectangle);
            newRecordScore.onresize = function() {
              this.setLocation(new Vector(0, 55));
              this.setSize(new Vector(this.parent.size.X, 100));
            };
            newRecordScore.onresize();

            newRecordScore.setString(newRecord, "#3D3", true);

            return newRecordScore;
          }();
        }

        gameOverPanel.restartButton = function() {
          var restartButton = new Panel(gameOverPanel, Panel.Rectangle);
          restartButton.onresize = function() {
            this.setLocation(new Vector(60, this.parent.size.Y - 65));
            this.setSize(new Vector((this.parent.getSize().X - this.parent.getLocation().X) / 2 - 15, 50));
          };
          restartButton.onresize();

          restartButton.setToClip(false);
          restartButton.setFillStyle("black");
          restartButton.setStrokeStyle("white", 5);


          restartButton.onmousedown = function() {
            this.setFillStyle("#333");
            this.invalidate();

            this.selected = true
          };

          restartButton.onmouseover = function() {
            this.setFillStyle("#222");
            this.invalidate();
          };

          restartButton.onmouseout = function() {
            this.selected = false;
            this.setFillStyle("black");
            this.invalidate();
          };

          restartButton.onmouseup = function() {
            if (!this.selected) return;

            gameOverDark.parent.removePanel(gameOverDark);
            gamePanel.elementGrid.newGame();
          };

          restartButton.onpaint = function() {
            Panel.ctx.beginPath();
            Panel.ctx.strokeStyle = "white";
            Panel.ctx.lineWidth = 3;
            Panel.ctx.arc(this.center.X, this.center.Y, 12, 0.2, Math.PI * 11 / 6);
            Panel.ctx.lineTo(49, 19);
            Panel.ctx.lineTo(54, 15);
            Panel.ctx.lineTo(54, 19);
            Panel.ctx.lineTo(49, 19);
            Panel.ctx.stroke();
          };

          return restartButton;
        }();

        return gameOverPanel;
      }();

      gameOverDark.invalidate();
      return gameOverDark;
    }();
  };


  var CollisionElement = function() {
    function CollisionElement(i, j, callback) {
      this.i = i;
      this.j = j;
      this.callback = callback;

      var figureChoose = Math.floor(Math.random() * 10);
      if (figureChoose < 4) {
        this.panel = new Panel(gamePanel.middlePanel.playground, Panel.Rectangle, new Vector(1 + j * 52, 1 + i * 52), new Vector(50, 50));
      } else if (figureChoose < 7) {
        var angle = Math.floor(Math.random() * 4);
        this.panel = new Panel(gamePanel.middlePanel.playground, Panel.RectangleTriangle, new Vector(1 + j * 52, 1 + i * 52), [new Vector(50, 50), angle]);
      } else if (figureChoose < 9) {
        var verticesNumber = Math.floor(Math.random() * 4) + 5;
        var angle = Math.floor(Math.random() * 360);
        this.panel = new Panel(gamePanel.middlePanel.playground, Panel.RegularPolygon, new Vector(1 + j * 52, 1 + i * 52), [25, verticesNumber, angle]);
      } else {
        this.panel = new Panel(gamePanel.middlePanel.playground, Panel.Circle, new Vector(1 + j * 52, 1 + i * 52), 50, 50);
      }

      gamePanel.middlePanel.playground.gameBall.addCheckCollision(this.panel);
      if (gamePanel.middlePanel.playground.gameBall.collision().length) {
        gamePanel.middlePanel.playground.removePanel(this.panel);
        gamePanel.middlePanel.playground.gameBall.removeCheckCollision(this.panel);
        this.error = 1;
        return;
      }
      this.panel.setIgnoremouse(true);
      this.panel.freeze();

      this.hitToDestroy = Math.floor(Math.random() * 3) + 1;
      this.setColor();


      var this_ = this;
      this.panel.onpostcollision = function() {
        if (!--this_.hitToDestroy) {
          this_.remove();
        } else {
          this_.setColor();
        }
      };
    }

    CollisionElement.prototype.endTurn = function() {
      this.hitToDestroy++;
      this.setColor();
    };

    CollisionElement.prototype.setColor = function() {
      var r, g, b;
      r = (this.hitToDestroy < 6) ? (250 - 50 * this.hitToDestroy) : 250;
      g = (this.hitToDestroy < 6) ? 250 : (250 - 50 * (this.hitToDestroy - 5));
      b = (this.hitToDestroy < 6) ? (250 - 50 * this.hitToDestroy) : 0;
      this.panel.setFillStyle("rgba(" + r + ", " + g + ", " + b + ", 0.1)");
      this.panel.setStrokeStyle("rgba(" + r + ", " + g + ", " + b + ", 1)", 5);
      this.panel.setString(this.hitToDestroy, "rgba(" + r + ", " + g + ", " + b + ", 1)", true);
    };

    CollisionElement.prototype.remove = function() {
      this.panel.parent.removePanel(this.panel);
      gamePanel.middlePanel.playground.gameBall.removeCheckCollision(this.panel);
      this.callback.destroied(this.i, this.j);
    };


    return CollisionElement;
  }();

  var BonusElement = function() {
    function BonusElement(i, j, callback, type) {
      this.i = i;
      this.j = j;
      this.callback = callback;
      var gameBall = gamePanel.middlePanel.playground.gameBall;

      if (type == BonusElement.Ball) {
        this.panel = new Panel(gameBall.parent, Panel.Circle, new Vector(1 + j * 52 + 18.5, 1 + i * 52 + 18.5), 13, "#ADD");

        this.panel.onprecollision = function(element) {
          if (!element.invisible) {
            gameBall.bonusBalls.push(this);
          }
        };

      } else if (type == BonusElement.Bumper) {
        this.panel = new Panel(gameBall.parent, Panel.Circle, new Vector(1 + j * 52 + 10, 1 + i * 52 + 10), 30, "rgba(180, 180,240, 0.7)");
        this.panel.setStrokeStyle("rgba(255,165, 0, 1)", 2)

        this.panel.freeze();

        this.maxHit = 20;

        var this_ = this;
        this.panel.onprecollision = function(element) {
          if (!element.invisible) {
            element.speed = element.speed.normalize().multiply(0.7);
            if (!--this_.maxHit) this_.remove();
          }
        };
        this.panel.onpaint = function(element) {
          Panel.ctx.beginPath();
          Panel.ctx.lineWidth = 1;
          Panel.ctx.strokeStyle = "rgba(255,165, 0, 0.7)";

          for (var i = 0; i < 8; i++) {
            Panel.ctx.transform.rotateRadAt(i * (Math.PI / 4), this.center)
            Panel.ctx.moveTo(this.center.X - 8, this.center.Y);
            Panel.ctx.lineTo(this.center.X - 13, this.center.Y);
            Panel.ctx.lineTo(this.center.X - 10, this.center.Y - 3);
            Panel.ctx.moveTo(this.center.X - 13, this.center.Y);
            Panel.ctx.lineTo(this.center.X - 10, this.center.Y + 3);
          }

          Panel.ctx.stroke();
        };
      } else if (type == BonusElement.Invisible) {
        this.panel = new Panel(gameBall.parent, Panel.Circle, new Vector(1 + j * 52 + 15, 1 + i * 52 + 15), 20, "rgba(255, 255, 255, 0.2)");

        var this_ = this;
        this.panel.onprecollision = function(element) {
          if (element.invisible) return true;
          element.invisible = true;
          element.setFillStyle("rgba(255, 255, 255, 0.5)");
          element.onprecollision = function(panel) {
            if (panel == this.parent) {
              return false;
            }
            if (this.lastCollided == panel) return true;

            element.lastCollided = panel;
            panel.onpostcollision();
            return true;
          };
          this_.remove();
          return true;
        };
      }

      gameBall.addCheckCollision(this.panel);
      if (gameBall.collision().length) {
        gamePanel.middlePanel.playground.removePanel(this.panel);
        gameBall.removeCheckCollision(this.panel);
        this.error = 1;
        return;
      }
      this.panel.manageCollision = gameBall.manageCollision;
      this.panel.acceleration = gameBall.parent.friction;
      this.panel.setIgnoremouse(true);
    }

    BonusElement.prototype.endTurn = function() {
      this.remove();
    };

    BonusElement.prototype.remove = function() {
      var gameBall = gamePanel.middlePanel.playground.gameBall;

      this.panel.parent.removePanel(this.panel);
      gameBall.removeCheckCollision(this.panel);
      this.callback.destroied(this.i, this.j);
    };

    BonusElement.Ball = 0;
    BonusElement.Bumper = 1;
    BonusElement.Invisible = 2;

    return BonusElement;
  }();

  gamePanel.elementGrid = function() {
    this.rows = 7;
    this.colums = 7;
    this.length = 0;
    this.elements = [];
    this.elementsMask = [];

    this.nextTurn = function(newBlocksNumber, first) {
      var gameBall = gamePanel.middlePanel.playground.gameBall;
      if (gameBall.invisible) {
        gameBall.setFillStyle("white");
        gameBall.onprecollision = function() {};
        gameBall.invisible = false;
      }

      if (!newBlocksNumber) newBlocksNumber = 1;

      var found = false;
      this.elements.forEach(function(element) {
        element.endTurn();
        if (element.hitToDestroy > 9) {
          found = true;
        } else if (element.hitToDestroy > 8) {
          element.panel.ontick = function() {
            if (!element.color) {
              element.color = true;
              element.colorRed = 255;
              element.goDown = true;
              element.panel.oldOnpostcollision = element.panel.onpostcollision;
              element.panel.onpostcollision = function() {
                this.ontick = function() {};
                this.onpostcollision = this.oldOnpostcollision;
                this.onpostcollision();
              }
            } else {
              if (element.goDown) {
                element.colorRed -= 3;
                if (element.colorRed < 130) element.goDown = false;
              } else {
                element.colorRed += 3;
                if (element.colorRed > 254) element.goDown = true;
              }
            }
            element.panel.setFillStyle("rgba(" + element.colorRed + ", 0, 0, 0.1)");
            element.panel.setStrokeStyle("rgba(" + element.colorRed + ", 0, 0, 1)", 5);
            element.panel.setFontStyle("rgba(" + element.colorRed + ", 0, 0, 1)");
          }
        }
      });
      if (found) {
        gamePanel.gameOver();
        return;
      }

      if (!first) {
        gamePanel.topPanel.scorePanel.increaseScore();

        newBlocksNumber = Math.floor(Math.random() * 2) + 1;

        if (this.length < 2 && newBlocksNumber == 1) newBlocksNumber++;
      }



      while (newBlocksNumber--) {
        if (this.elementsMask.length < 1) return;
        var removed = [];
        while (elementsMask.length) {
          var randomIndex = Math.floor(Math.random() * elementsMask.length);
          var elementID = this.elementsMask[randomIndex];
          this.elementsMask.splice(randomIndex, 1);
          var i = Math.floor(elementID / this.colums);
          var j = elementID % this.colums;
          var newElement;
          newElement = new CollisionElement(i, j, this);
          if (!newElement.error) {
            this.elements[i * this.colums + j] = newElement;
            this.length++;
            break;
          } else {
            removed.push(elementID);
          }
        }
        removed.forEach(function(element) {
          this.elementsMask.push(element);
        });
      }


      var bonusElements = []

      for (var k = 0; k < 3; k++) {
        if (Math.floor(Math.random() * 2) == 0) {
          bonusElements.push(BonusElement.Ball);
        }
      }

      var n_invis = 0;
      if (Math.floor(Math.random() * 2) == 0) {
        bonusElements.push(BonusElement.Bumper);
        bonusElements.push(BonusElement.Invisible);
        n_invis++;
      }


      for (var k = 0; k < 2 - n_invis; k++) {
        if (Math.floor(Math.random() * 2) == 0) {
          bonusElements.push(BonusElement.Invisible);
        }
      }

      for (var k = 0; k < bonusElements.length; k++) {
        var removed = [];
        while (elementsMask.length) {
          var randomIndex = Math.floor(Math.random() * elementsMask.length);
          var elementID = this.elementsMask[randomIndex];
          this.elementsMask.splice(randomIndex, 1);
          var i = Math.floor(elementID / this.colums);
          var j = elementID % this.colums;
          var newElement;
          newElement = new BonusElement(i, j, this, bonusElements[k]);
          if (!newElement.error) {
            this.elements[i * this.colums + j] = newElement;
            this.length++;
            break;
          } else {
            removed.push(elementID);
          }
        }
        removed.forEach(function(element) {
          this.elementsMask.push(element);
        });
      }

    };

    this.destroied = function(i, j) {
      this.length--;
      var elementIndex = i * this.colums + j;
      this.elementsMask.push(elementIndex);
      delete this.elements[elementIndex];
    };

    this.newGame = function() {
      var gameBall = gamePanel.middlePanel.playground.gameBall;
      gameBall.free = true;
      gameBall.bonusBalls = [];

      this.elements.forEach(function(p) {
        p.remove();
      });

      this.length = 0;
      this.elements = [];
      this.elementsMask = [];

      for (var i = 0; i < this.rows; i++)
        for (var j = 0; j < this.colums; j++)
          elementsMask.push(i * this.colums + j);


      gamePanel.timerPanel.reset();
      gameBall.speed = new Vector();
      gameBall.inMovement = false;
      gameBall.startPosition();
      gamePanel.topPanel.scorePanel.resetScore();
      gamePanel.invalidate();
      this.nextTurn(5, true);
    };


    return this;
  }();

  gamePanel.elementGrid.newGame();

  return gamePanel;
}();

var introPanel = function() {
  var timeline = new Timeline();

  var introPanel = new Panel(Panel.container, Panel.Rectangle);
  introPanel.onresize = function() {
    this.transform.resetMatrix();
    var containerSize = Panel.container.getSize();
    var minSize = Math.min(containerSize.X, containerSize.Y);
    this.setSize(new Vector(560, 560));
    this.setLocation(Panel.container.getCenter());
    this.translate(new Vector(-280, -280));
    this.scale(minSize / 560);
  };
  introPanel.onresize();

  introPanel.setIgnoremouse(true);

  introPanel.ontick = function(delta) {
    timeline.update(delta);
  };

  var midpoints = [];
  var numberSquares = 4;

  for (var i = 0; i < numberSquares; i++) {
    var square = new Panel(introPanel, Panel.Rectangle,
      new Vector(introPanel.center.X - (numberSquares / 2 - i) * 110 + 5, introPanel.center.Y - 50), new Vector(100, 100), "blue");
    midpoints[i] = square.getLocation();

    square.setIgnoremouse(true);

    timeline.add(new Animation(0, 1, 2000, 0, function(square, opacity) {
      square.setFillStyle("rgba(0, 0, 255, " + opacity + ")");
    }.bind(null, square)));
  }

  var circle = new Panel(introPanel, Panel.Circle, undefined, 30, "red");
  timeline.add(new Animation(0, 1, 5000, 2000, function(t) {

    if (t < 1 / 5) {
      t = t * 5;
      circle.setLocation(new Vector(t * midpoints[0].X - 15 + 50, t * midpoints[0].Y - 30));
      circle.setFillStyle("rgba(255, 0, 0, " + t + ")");
    } else if (t < 1) {
      t = t * 5;
      var i = Math.floor(t);
      t -= i;
      var start = midpoints[i - 1];
      var end = i < 4 ? midpoints[i] : new Vector(start.X + 100, start.Y);
      var deltaX = end.X - start.X;
      var x = start.X + t * deltaX - 15;
      var y = end.Y - 30;
      var radius = deltaX / 2
      var y = y - Math.sqrt(Math.pow(radius, 2) - Math.pow(t * radius * 2 - radius, 2)) + 5;
      circle.setLocation(new Vector(x + 50, y));
      if (i == 4) {
        circle.setFillStyle("rgba(255, 0, 0, " + (1 - t) + ")");
      }
    }

  }));
  circle.setIgnoremouse(true);

  var letterP = new Panel(introPanel, Panel.Rectangle, midpoints[0], new Vector(100, 100));
  letterP.setString("P", "transparent", true, 50);
  timeline.add(new Animation(0, 1, 500, 3000, function(opacity) {
    letterP.setFontStyle("rgba(0, 0, 15, " + opacity + ")");
  }));
  letterP.setIgnoremouse(true);

  var letterL = new Panel(introPanel, Panel.Rectangle, midpoints[1], new Vector(100, 100));
  letterL.setString("L", "transparent", true, 50);
  timeline.add(new Animation(0, 1, 500, 4000, function(opacity) {
    letterL.setFontStyle("rgba(0, 0, 15, " + opacity + ")");
  }));
  letterL.setIgnoremouse(true);

  var letterA = new Panel(introPanel, Panel.Rectangle, midpoints[2], new Vector(100, 100));
  letterA.setString("A", "transparent", true, 50);
  timeline.add(new Animation(0, 1, 500, 5000, function(opacity) {
    letterA.setFontStyle("rgba(0, 0, 15, " + opacity + ")");
  }));
  letterA.setIgnoremouse(true);

  var letterY = new Panel(introPanel, Panel.Rectangle, midpoints[3], new Vector(100, 100));
  letterY.setString("Y", "transparent", true, 50);
  timeline.add(new Animation(0, 1, 500, 6000, function(opacity) {
    letterY.setFontStyle("rgba(0, 0, 15, " + opacity + ")");
  }));
  letterY.setIgnoremouse(true);

  Panel.container.onmouseup = function() {
    introPanel.stopAnimation();
    this.removePanel(introPanel);
    Panel.container.onmouseup = function() {};
    this.addPanel(gamePanel);
    gamePanel.resize();
    gamePanel.startAnimationPhysics();
  };

  introPanel.startAnimation();


  return introPanel;

}();