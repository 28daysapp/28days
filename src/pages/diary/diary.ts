import { Component, ViewChildren, QueryList, Directive, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

/**
 * Generated class for the DiaryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Directive({selector: 'canvas'})
export class Canvas {
}

@IonicPage()
@Component({
  selector: 'page-diary',
  templateUrl: 'diary.html',
})
export class DiaryPage implements AfterViewInit {
	@ViewChildren('lineCanvas') lineCanvases:QueryList<Canvas>;
	@ViewChildren('lineCanvas2') lineCanvases2:QueryList<Canvas>;
	@ViewChildren('lineCanvas3') lineCanvases3:QueryList<Canvas>;
	@ViewChildren('barCanvas') barCanvas:QueryList<Canvas>;

	button1src = 'assets/diary11.png';
	button2src = 'assets/diary2.png';
	button3src = 'assets/diary3.png';
	button4src = 'assets/diary4.png';
	button1chose = true;
	button2chose = false;
	button3chose = false;
	button4chose = false;
	showLineChart = true;
	showLineChart2 = false;
	showLineChart3 = false;
	showBarChart = false;

	d;
	year;
	month;
	dayArrays;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	console.log('constructor');
  	this.d = new Date();
  	this.year = this.d.getFullYear();
  	this.month = this.d.getMonth() + 1;
  	this.dayArrays = this.createDayArrays(this.d.getDay(), this.daysInMonth(this.year, this.month));
  }

  ionViewDidLoad() {
  	console.log('ionViewDidLoad');
  }

  ngAfterViewInit() {
  	console.log('ngAfterViewInit');
  	var i = 0;
  	this.lineCanvases.forEach(lc => {
  		this.createLineChart(lc, this.dayArrays[i], this.createTestArray(this.dayArrays[i]));
  		i++;
  	});
  	this.lineCanvases.changes.subscribe((r) => {
  		var i = 0;
  		this.lineCanvases.forEach(lc => {
	  		this.createLineChart(lc, this.dayArrays[i], this.createTestArray(this.dayArrays[i]));
	  		i++;
	  	});
  	});
  	this.lineCanvases2.changes.subscribe((r) => {
  		var i = 0;
  		this.lineCanvases2.forEach(lc => {
	  		this.createLineChart2(lc, this.dayArrays[i], this.createTestArray2(this.dayArrays[i]));
	  		i++;
	  	});
  	});
  	this.lineCanvases3.changes.subscribe((r) => {
  		var i = 0;
  		this.lineCanvases3.forEach(lc => {
	  		this.createLineChart3(lc, this.dayArrays[i], this.createTestArray3(this.dayArrays[i]));
	  		i++;
	  	});
  	});
  	this.barCanvas.changes.subscribe((r) => {
  		if (this.barCanvas.first == null) {
	  		return;
	  	}
  		this.createBarChart(this.barCanvas.first);
  	});
  }

  daysInMonth (year, month) {
    return new Date(year, month, 0).getDate();
	}

	createDayArrays(firstday, daysinmonth) {
  	var dayArrays = [];
  	var dayArray = [];
  	for (var i = 0; i < daysinmonth; i++) {
  		if (firstday % 7 == 0) {
  			if (dayArray.length != 0) {
  				dayArrays.push(this.fillnull(dayArray));
  			}
  			dayArray = [];
  			dayArray.push(i + 1);
  		} else {
  			dayArray.push(i + 1);
  		}
  		firstday++;
  	}
  	if (dayArray.length != 0) {
			dayArrays.push(this.fillnull(dayArray));
		}
		console.log(JSON.stringify(dayArrays));
  	return dayArrays;
  }

  createTestArray(dayarray) {
  	var testArray = [];
  	for (var i = 0; i < dayarray.length; i++) {
  		if (dayarray[i]) {
  			testArray.push(i % 5 + 1);
  		} else {
  			testArray.push(null);
  		}
  	}
  	return testArray;
  }

  createTestArray2(dayarray) {
  	var testArray = [];
  	for (var i = 0; i < dayarray.length; i++) {
  		if (dayarray[i]) {
  			testArray.push(i % 3 + 1);
  		} else {
  			testArray.push(null);
  		}
  	}
  	return testArray;
  }

  createTestArray3(dayarray) {
  	var testArray = [];
  	for (var i = 0; i < dayarray.length; i++) {
  		if (dayarray[i]) {
  			testArray.push(i % 2);
  		} else {
  			testArray.push(null);
  		}
  	}
  	return testArray;
  }

  fillnull(dayarray) {
  	if (dayarray[0] == 1) {
	  	while (dayarray.length != 7) {
	  		dayarray.unshift(null);
	  	}
	  } else {
	  	while (dayarray.length != 7) {
	  		dayarray.push(null);
	  	}
	  }
	  return dayarray;
  }

  monthprev() {
  	if (this.month == 1) {
  		this.d.setFullYear(this.year - 1, 11, 1);
  	} else {
  		this.d.setFullYear(this.year, this.month - 2, 1);
  	}
  	this.year = this.d.getFullYear();
  	this.month = this.d.getMonth() + 1;
  	this.dayArrays = this.createDayArrays(this.d.getDay(), this.daysInMonth(this.year, this.month));
  	this.button1();
  }

  monthnext() {
  	if (this.month == 12) {
  		this.d.setFullYear(this.year + 1, 0, 1);
  	} else {
  		this.d.setFullYear(this.year, this.month, 1);
  	}
  	this.year = this.d.getFullYear();
  	this.month = this.d.getMonth() + 1;
  	this.dayArrays = this.createDayArrays(this.d.getDay(), this.daysInMonth(this.year, this.month));
  	this.button1();
  }

  button1() {
  	this.button1src = 'assets/diary11.png';
		this.button2src = 'assets/diary2.png';
		this.button3src = 'assets/diary3.png';
		this.button4src = 'assets/diary4.png';
  	this.button1chose = true;
		this.button2chose = false;
		this.button3chose = false;
		this.button4chose = false;
		this.showLineChart = true;
		this.showLineChart2 = false;
		this.showLineChart3 = false;
		this.showBarChart = false;
  }

  button2() {
  	this.button1src = 'assets/diary1.png';
		this.button2src = 'assets/diary22.png';
		this.button3src = 'assets/diary3.png';
		this.button4src = 'assets/diary4.png';
  	this.button1chose = false;
		this.button2chose = true;
		this.button3chose = false;
		this.button4chose = false;
		this.showLineChart = false;
		this.showLineChart2 = true;
		this.showLineChart3 = false;
		this.showBarChart = false;
  }

  button3() {
  	this.button1src = 'assets/diary1.png';
		this.button2src = 'assets/diary2.png';
		this.button3src = 'assets/diary33.png';
		this.button4src = 'assets/diary4.png';
  	this.button1chose = false;
		this.button2chose = false;
		this.button3chose = true;
		this.button4chose = false;
		this.showLineChart = false;
		this.showLineChart2 = false;
		this.showLineChart3 = true;
		this.showBarChart = false;
  }

  button4() {
  	this.button1src = 'assets/diary1.png';
		this.button2src = 'assets/diary2.png';
		this.button3src = 'assets/diary3.png';
		this.button4src = 'assets/diary44.png';
  	this.button1chose = false;
		this.button2chose = false;
		this.button3chose = false;
		this.button4chose = true;
		this.showLineChart = false;
		this.showLineChart2 = false;
		this.showLineChart3 = false;
		this.showBarChart = true;
  }

  createLineChart(canvas, labels, data) {
  	var colorArray = [];
  	for (var i = 0; i < data.length; i++) {
  		if (data[i]) {
  			if (data[i] < 3) {
  				colorArray.push('rgba(160,160,160,1)');
  			} else {
  				colorArray.push('rgba(97,185,105,1)');
  			}
  		} else {
  			colorArray.push(null);
  		}
  	}
  	var chart = new Chart(canvas.nativeElement, {
      type: 'line',
      data: {
      	labels: labels,
        datasets: [{
        	label: '',
        	data: data,
        	backgroundColor: 'rgba(97,185,105,1)',
        	borderColor: 'rgba(97,185,105,1)',
        	borderWidth: 1.5,
        	borderJoinStyle: 'round',
        	fill: false,
        	lineTension: 0,
        	pointBackgroundColor: colorArray,
        	pointBorderColor: colorArray,
        	pointBorderWidth: 0,
        	pointRadius: 2.5,
        	spanGaps: true
        }]
      },
      options: {
      	layout: {
          padding: {
            left: 12,
            right: 23,
            top: 5,
            bottom: -5
          }
        },
        tooltips: {
        	enabled: false
        },
      	legend: {
				  display: false,
				},
        scales: {
        	xAxes: [{
        		ticks: {
            	display: false,
            },
            gridLines: {
        			display: false,
        			drawBorder: false
        		}
        	}],
          yAxes: [{
            ticks: {
            	display: false,
              max: 5,
              min: 1,
              stepSize: 1
            },
            gridLines: {
        			display: false,
        			drawBorder: false
        		}
        	}]
        },
        animation: {
          duration: 0, // general animation time
        },
        hover: {
          animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
    	}
	  });
  	return chart;
  }

  createLineChart2(canvas, labels, data) {
  	var colorArray = [];
  	for (var i = 0; i < data.length; i++) {
  		if (data[i]) {
  			if (data[i] < 2) {
  				colorArray.push('rgba(160,160,160,1)');
  			} else {
  				colorArray.push('rgba(97,185,105,1)');
  			}
  		} else {
  			colorArray.push(null);
  		}
  	}
  	var chart = new Chart(canvas.nativeElement, {
      type: 'line',
      data: {
      	labels: labels,
        datasets: [{
        	label: '',
        	data: data,
        	backgroundColor: 'rgba(97,185,105,1)',
        	borderColor: 'rgba(97,185,105,1)',
        	borderWidth: 1.5,
        	borderJoinStyle: 'round',
        	fill: false,
        	lineTension: 0,
        	pointBackgroundColor: colorArray,
        	pointBorderColor: colorArray,
        	pointBorderWidth: 0,
        	pointRadius: 2.5,
        	spanGaps: true
        }]
      },
      options: {
      	layout: {
          padding: {
            left: 12,
            right: 23,
            top: 5,
            bottom: -5
          }
        },
        tooltips: {
        	enabled: false
        },
      	legend: {
				  display: false,
				},
        scales: {
        	xAxes: [{
        		ticks: {
            	display: false,
            },
            gridLines: {
        			display: false,
        			drawBorder: false
        		}
        	}],
          yAxes: [{
            ticks: {
            	display: false,
              max: 3,
              min: 1,
              stepSize: 1
            },
            gridLines: {
        			display: false,
        			drawBorder: false
        		}
        	}]
        },
        animation: {
          duration: 0, // general animation time
        },
        hover: {
          animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
    	}
	  });
  	return chart;
  }

  createLineChart3(canvas, labels, data) {
  	var dataArray = [];
  	var colorArray = [];
  	for (var i = 0; i < data.length; i++) {
  		if (data[i] != null) {
  			if (data[i] == 0) {
  				colorArray.push('rgba(245,61,61,1)');
  			} else {
  				colorArray.push('rgba(72,138,255,1)');
  			}
  			dataArray.push(1);
  		} else {
  			colorArray.push(null);
  			dataArray.push(null);
  		}
  	}
  	var chart = new Chart(canvas.nativeElement, {
      type: 'line',
      data: {
      	labels: labels,
        datasets: [{
        	label: '',
        	data: dataArray,
        	backgroundColor: 'rgba(160,160,160,1)',
        	borderColor: 'rgba(160,160,160,1)',
        	borderWidth: 1.5,
        	borderJoinStyle: 'round',
        	fill: false,
        	lineTension: 0,
        	pointBackgroundColor: colorArray,
        	pointBorderColor: colorArray,
        	pointBorderWidth: 0,
        	pointRadius: 5,
        	spanGaps: true
        }]
      },
      options: {
      	layout: {
          padding: {
            left: 12,
            right: 23,
            top: 5,
            bottom: -5
          }
        },
        tooltips: {
        	enabled: false
        },
      	legend: {
				  display: false,
				},
        scales: {
        	xAxes: [{
        		ticks: {
            	display: false,
            },
            gridLines: {
        			display: false,
        			drawBorder: false
        		}
        	}],
          yAxes: [{
            ticks: {
            	display: false,
              max: 2,
              min: 0,
              stepSize: 1
            },
            gridLines: {
        			display: false,
        			drawBorder: false
        		}
        	}]
        },
        animation: {
          duration: 0, // general animation time
        },
        hover: {
          animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
    	}
	  });
  	return chart;
  }

  createBarChart(canvas) {
  	var chart = new Chart(canvas.nativeElement, {
	  	type: 'bar',
	    data: {
        labels: ["28일 전", "19일 전", "8일 전", "오늘"],
        datasets: [{
          data: [21, 19, 27, 14],
          backgroundColor: 'rgba(97,185,105,0.5)',
          borderColor: 'rgba(97,185,105,1)',
          borderWidth: 1
        }]
	    },
	    options: {
	    	tooltips: {
        	enabled: false
        },
	    	legend: {
				  display: false,
				},
        scales: {
          xAxes: [{
            barPercentage: 0.4,
            gridLines: {
        			display: false
        		}
        	}],
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        },
        animation: {
        	duration: 0, // general animation time
		      onComplete: function() {
		        var ctx = this.chart.ctx;
		        ctx.textAlign = "center";
		        ctx.textBaseline = "middle";
		        var chart = this;
		        var datasets = this.config.data.datasets;

		        datasets.forEach(function (dataset: Array<any>, i: number) {
		          ctx.font = "10px Arial";
		          ctx.fillStyle = "Black";
		          chart.getDatasetMeta(i).data.forEach(function (p: any, j: any) {
		            ctx.fillText(datasets[i].data[j], p._model.x, p._model.y - 10);
		          });
		        });
		      }
		    },
        hover: {
          animationDuration: 0, // duration of animations when hovering an item
        },
        responsiveAnimationDuration: 0, // animation duration after a resize
	    }
		});
  	return chart;
  }

}
