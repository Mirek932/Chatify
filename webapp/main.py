import sys
from PyQt5.QtWidgets import *
from PyQt5.QtWebEngineWidgets import *
from PyQt5.QtCore import *
import urllib.parse
from PyQt5 import uic

class MainWindow(QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.browser = QWebEngineView()
        self.browser.setUrl(QUrl('http://localhost:3000')) #Google com
        self.setCentralWidget(self.browser)
        self.showMaximized()



app = QApplication(sys.argv)
QApplication.setApplicationName('Chatify')
window = MainWindow()
app.exec_()