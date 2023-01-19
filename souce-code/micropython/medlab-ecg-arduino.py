from machine import UART, Pin
import time
import array

uart = UART(0, baudrate=115200, bits=8, parity=0, stop=1)

def limblead():
    uart.write(b'\x43')
    uart.write(b'\x7F')

def chestlead():
    uart.write(b'\x44')
    uart.write(b'\x1F')

def freq():
    uart.write(b'\x53')
    uart.write(b'\x31') #freq set to 100Hz

def mode():
    uart.write(b'\x46')
    uart.write(b'\x31') #set to monitoring mode

def filter():
    uart.write(b'\x35')
    uart.write(b'\x31') #filter set to 50Hz

limblead()
chestlead()
freq()
mode()
filter()

while True:
    if uart.any():
        buf = array.array('B', [0] * 7200)
        head = uart.readinto(buf)
        for i in range(head):
            print(buf[i]) #read through the buffer
