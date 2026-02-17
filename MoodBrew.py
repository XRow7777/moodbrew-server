import tkinter as tk
from tkinter import font, filedialog, PhotoImage
from tkinter import messagebox
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time
from PIL import Image, ImageTk
import datetime
import pytz
import requests
import ast
import base64
import io
import re
from tkinter import simpledialog
from bson import ObjectId

uploaded_image_b64 = None

EMAIL = ""
PASSWORD = ""
USERTYPE = None
ALL_USERS = []
CURRENT_USER = None

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USER = "noreplymoodbrew@gmail.com"
SMTP_PASS = "mncs rqhc uiub zjii"

verification_code = None
code_sent_time = None

def enlarge_button(event):
    event.widget.config(width=370, height=93)
def shrink_button(event):
    event.widget.config(width=360, height=90)

def enlarge_buttonApply(event):
    event.widget.config(width=350, height=90)
def shrink_buttonApply(event):
    event.widget.config(width=340, height=85)
def enlarge_buttonCancel(event):
    event.widget.config(width=220, height=65)
def shrink_buttonCancel(event):
    event.widget.config(width=210, height=60)

# ------------------------

def fetch_users():
    global ALL_USERS
    try:
        url = "https://moodbrew-server.onrender.com/collection/users"
        response = requests.get(url)
        if response.status_code == 200:
            ALL_USERS = response.json()
        else:
            ALL_USERS = []
    except Exception as e:
        ALL_USERS = []
    
def fetch_feedbacks():
    try:
        url = "https://moodbrew-server.onrender.com/collection/feedbacks"
        response = requests.get(url)
        if response.status_code == 200:
            users = response.json()
            return users
        else:
            print("Failed to fetch users:", response.status_code)
            return []
    except Exception as e:
        print("Error fetching users:", e)
        return []
    
def fetch_orders():
    try:
        url = "https://moodbrew-server.onrender.com/collection/orders"
        response = requests.get(url)
        if response.status_code == 200:
            users = response.json()
            return users
        else:
            print("Failed to fetch users:", response.status_code)
            return []
    except Exception as e:
        print("Error fetching users:", e)
        return []

def fetch_totalsales():
    try:
        url = "https://moodbrew-server.onrender.com/collection/totalsales"
        response = requests.get(url)
        if response.status_code == 200:
            users = response.json()
            return users
        else:
            print("Failed to fetch users:", response.status_code)
            return []
    except Exception as e:
        print("Error fetching users:", e)
        return []

def fetch_inventory():
    try:
        url = "https://moodbrew-server.onrender.com/collection/inventory"
        response = requests.get(url)
        if response.status_code == 200:
            users = response.json()
            return users
        else:
            print("Failed to fetch users:", response.status_code)
            return []
    except Exception as e:
        print("Error fetching users:", e)
        return []
    
# ------------------------


def update_time(label):
    philippine_time = pytz.timezone("Asia/Manila")
    current_time = datetime.datetime.now(philippine_time)
    time_string = current_time.strftime("%A, %B %d, %Y %I:%M:%S %p")  # Format: Day, Month Date, Year HH:MM:SS AM/PM
    label.config(text=time_string)
    label.after(1000, update_time, label)  # Update every second


# ------------------------


def uploadRemovephoto(photo_frame, button):
    global uploaded_image_b64

    from tkinter import filedialog
    file_path = filedialog.askopenfilename(filetypes=[("Image files", "*.jpg *.jpeg *.png")])
    if not file_path:
        return

    try:
        img = Image.open(file_path).resize((180, 180), Image.LANCZOS)
        photo = ImageTk.PhotoImage(img)

        for widget in photo_frame.winfo_children():
            widget.destroy()

        label = tk.Label(photo_frame, image=photo, bg="#f8ece4")
        label.image = photo
        label.pack()

        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        uploaded_image_b64 = base64.b64encode(buffered.getvalue()).decode()
        button.config(text="Remove", command=lambda: remove_photo(photo_frame, button))

    except Exception as e:
        messagebox.showerror("Error", f"Failed to upload image: {e}")

def remove_photo(photo_frame, button):
    global uploaded_image_b64
    uploaded_image_b64 = None
    for widget in photo_frame.winfo_children():
        widget.destroy()
    button.config(text="Upload", command=lambda: uploadRemovephoto(photo_frame, button))


# ------------------------


def create_rounded_rect(canvas, x1, y1, x2, y2, radius=10, **kwargs):
    points = [
        x1+radius, y1,
        x2-radius, y1,
        x2, y1,
        x2, y1+radius,
        x2, y2-radius,
        x2, y2,
        x2-radius, y2,
        x1+radius, y2,
        x1, y2,
        x1, y2-radius,
        x1, y1+radius,
        x1, y1
    ]
    return canvas.create_polygon(points, **kwargs, smooth=True)

# ------------------------

def send_verification_code(email):
    global verification_code, code_sent_time
    verification_code = ''.join(random.choices(string.digits, k=7))
    code_sent_time = time.time()

    msg = MIMEMultipart()
    msg['From'] = f"MoodBrew <{SMTP_USER}>"
    msg['To'] = email
    msg['Subject'] = "MoodBrew: Verification Code"

    body = f"Your Code is: \n\n{verification_code}\n\nThis is an OTC (One Time Code)"
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        text = msg.as_string()
        server.sendmail(SMTP_USER, email, text)
        server.quit()

        messagebox.showinfo("Moodbrew: Verification Code", f"Verification code sent to {email}")
    except Exception as e:
        messagebox.showerror("Moodbrew: Error", f"Failed to send verification code: {str(e)}")



# ------------------------



def verify_login():
    global EMAIL, PASSWORD, USERTYPE, CURRENT_USER

    EMAIL = email_entry.get()
    PASSWORD = password_entry.get()

    if not ALL_USERS:
        fetch_users()

    for user in ALL_USERS:
        if user["email"] == EMAIL and user["password"] == PASSWORD:
            USERTYPE = user["usertype"]
            CURRENT_USER = user
            send_verification_code(EMAIL)
            prompt_verification_code()
            return
        
    messagebox.showerror("Moodbrew: Login", "Invalid email or password\n\nNOTE: If you have changed your password recently and still getting this error message, please CLOSE the app and OPEN it again.")



# ------------------------



def prompt_verification_code(callback=None):
    def check_code():
        global USERTYPE
        entered_code = code_entry.get()
        current_time = time.time()

        if current_time - code_sent_time > 180:
            messagebox.showerror("Moodbrew: Error", "Verification code expired. Please request a new code.")
        elif entered_code == verification_code:
            messagebox.showinfo("Moodbrew", "Code verified successfully.")
            if USERTYPE == 1:
                show_manager_home_page(email_entry.get())
            elif USERTYPE == 2:
                show_employee_home_page(email_entry.get())
            code_window.destroy()
            if callback:
                callback()
        else:
            messagebox.showerror("Moodbrew: Error", "Invalid verification code.")

    global code_entry, code_window
    code_window = tk.Toplevel()
    code_window.title("Enter Verification Code")

    window_width = 400
    window_height = 200
    screen_width = code_window.winfo_screenwidth()
    screen_height = code_window.winfo_screenheight()
    center_x = int(screen_width / 2 - window_width / 2)
    center_y = int(screen_height / 2 - window_height / 2)
    code_window.geometry(f"{window_width}x{window_height}+{center_x}+{center_y}")
    code_window.config(bg="#ffd1dc")
    code_window.iconbitmap(r"C:\Assets\MoodBrewBG\icon.ico")

    jua_font = font.Font(family="Arial", size=14, weight="bold")

    tk.Label(code_window, text="Enter the verification code:", font=jua_font, bg="#ffd1dc").pack(pady=10)

    code_entry = tk.Entry(code_window, font=jua_font)
    code_entry.pack(pady=10)
    tk.Button(code_window, text="Verify", font=jua_font, command=check_code).pack(pady=10)

    timer_label = tk.Label(code_window, font=jua_font, fg="red", bg="#ffd1dc")
    timer_label.pack(pady=5)

    def start_timer(count):
        mins, secs = divmod(count, 60)
        time_format = f"{mins:01}:{secs:02}"
        timer_label.config(text=f"Code expires in {time_format}")
        if count > 0:
            code_window.after(1000, start_timer, count - 1)
        else:
            timer_label.config(text="Code expired", fg="darkred")

    start_timer(180)  


# ------------------------
# LOADINGS EMP

def loadingCD(): #Create Drinks EMP

    def loading_animation(label):
        base_text = "Loading Orders "
        frames = [base_text, base_text + ".", base_text + "..", base_text + "..."]

        def animate(frame=0):
            label.config(text=frames[frame % len(frames)])
            label.after(100, animate, frame + 1)
        animate()

    for widget in login_window.winfo_children():
            widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\bgEmpty.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    loading_label = tk.Label(login_window, text="Loading Orders ", font=font.Font(family="Arial", size=55, weight="bold"), bg="#ffd1dc", fg="black")
    loading_label.place(x=230, y=260)
    loading_animation(loading_label)

    login_window.after(2000, createDrink)

# ------------------------

def loadingVI(): #View Inventory EMP

    def loading_animation(label):
        base_text = "Loading Inventory "
        frames = [base_text, base_text + ".", base_text + "..", base_text + "..."]

        def animate(frame=0):
            label.config(text=frames[frame % len(frames)])
            label.after(100, animate, frame + 1)
        animate()

    for widget in login_window.winfo_children():
            widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\bgEmpty.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    loading_label = tk.Label(login_window, text="Loading Inventory ", font=font.Font(family="Arial", size=55, weight="bold"), bg="#ffd1dc", fg="black")
    loading_label.place(x=210, y=290)
    loading_animation(loading_label)

    login_window.after(2000, inventory_listEMP)


# ------------------------


def loadingOH(): #Order History EMP

    def loading_animation(label):
        base_text = "Loading Orders "
        frames = [base_text, base_text + ".", base_text + "..", base_text + "..."]

        def animate(frame=0):
            label.config(text=frames[frame % len(frames)])
            label.after(100, animate, frame + 1)
        animate()

    for widget in login_window.winfo_children():
            widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\bgEmpty.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    loading_label = tk.Label(login_window, text="Loading Orders ", font=font.Font(family="Arial", size=55, weight="bold"), bg="#ffd1dc", fg="black")
    loading_label.place(x=230, y=290)
    loading_animation(loading_label)

    login_window.after(2000, order_historyEMP)


# ------------------------
# LOADINGS Manager

def loadingVIManager(): #View Inventory Manager

    def loading_animation(label):
        base_text = "Loading Inventory "
        frames = [base_text, base_text + ".", base_text + "..", base_text + "..."]

        def animate(frame=0):
            label.config(text=frames[frame % len(frames)])
            label.after(100, animate, frame + 1)
        animate()

    for widget in login_window.winfo_children():
            widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\bgEmpty.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    loading_label = tk.Label(login_window, text="Loading Inventory ", font=font.Font(family="Arial", size=55, weight="bold"), bg="#ffd1dc", fg="black")
    loading_label.place(x=210, y=290)
    loading_animation(loading_label)

    login_window.after(2000, inventory_list)

# ------------------------



def loadingEManager(): #View Employees

    def loading_animation(label):
        base_text = "Loading Employees "
        frames = [base_text, base_text + ".", base_text + "..", base_text + "..."]

        def animate(frame=0):
            label.config(text=frames[frame % len(frames)])
            label.after(100, animate, frame + 1)
        animate()

    for widget in login_window.winfo_children():
            widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\bgEmpty.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    loading_label = tk.Label(login_window, text="Loading Employees ", font=font.Font(family="Arial", size=55, weight="bold"), bg="#ffd1dc", fg="black")
    loading_label.place(x=210, y=290)
    loading_animation(loading_label)

    login_window.after(2000, manage_employee_accounts)



# ------------------------

def loadingOHManager(): #Order History Manager

    def loading_animation(label):
        base_text = "Loading Orders "
        frames = [base_text, base_text + ".", base_text + "..", base_text + "..."]

        def animate(frame=0):
            label.config(text=frames[frame % len(frames)])
            label.after(100, animate, frame + 1)
        animate()

    for widget in login_window.winfo_children():
            widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\bgEmpty.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    loading_label = tk.Label(login_window, text="Loading Orders ", font=font.Font(family="Arial", size=50, weight="bold"), bg="#ffd1dc", fg="black")
    loading_label.place(x=230, y=290)
    loading_animation(loading_label)

    login_window.after(2000, order_history)



# ------------------------


def loadingItemsManager(): #Inventory Items

    def loading_animation(label):
        base_text = "Loading Items "
        frames = [base_text, base_text + ".", base_text + "..", base_text + "..."]

        def animate(frame=0):
            label.config(text=frames[frame % len(frames)])
            label.after(100, animate, frame + 1)
        animate()

    for widget in login_window.winfo_children():
            widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\bgEmpty.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    loading_label = tk.Label(login_window, text="Loading Items ", font=font.Font(family="Arial", size=55, weight="bold"), bg="#ffd1dc", fg="black")
    loading_label.place(x=270, y=290)
    loading_animation(loading_label)

    login_window.after(2000, edit_inventory_items)


# ------------------------


def loadingRGManager(): #Reports

    def loading_animation(label):
        base_text = "Loading Reports "
        frames = [base_text, base_text + ".", base_text + "..", base_text + "..."]

        def animate(frame=0):
            label.config(text=frames[frame % len(frames)])
            label.after(100, animate, frame + 1)
        animate()

    for widget in login_window.winfo_children():
            widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\bgEmpty.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    if "Jua" in font.families():
        jua_font_large = font.Font(family="Jua", size=27)
        jua_font_medium = font.Font(family="Jua", size=20)
    else:
        jua_font_large = font.Font(family="Helvetica", size=27)
        jua_font_medium = font.Font(family="Helvetica", size=20)

    loading_label = tk.Label(login_window, text="Loading Reports ", font=font.Font(family="Jua", size=55), bg="#ffd1dc", fg="black")
    loading_label.place(x=250, y=290)
    loading_animation(loading_label)

    login_window.after(2000, reportsGen)


# ------------------------


def show_manager_home_page(email):
    global imgInvL, imgMEE, imgEII, imgOH, imgREP, imgLOG

    for widget in login_window.winfo_children():
        widget.destroy()

    login_window.title("Mood Brew - Manager Portal")

    bg_path = r"C:\Assets\MoodBrewBG\homepagebgM.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    if "Jua" in font.families():
        jua_font_large = font.Font(family="Jua", size=24)
        jua_font_medium = font.Font(family="Jua", size=20)
    else:
        jua_font_large = font.Font(family="Helvetica", size=24)
        jua_font_medium = font.Font(family="Helvetica", size=20)

    time_label = tk.Label(login_window, font=font.Font(family="Lato", size=16), bg="#FEF8FA", fg="black")
    time_label.place(x=555, y=15)
    update_time(time_label)

    imgx = Image.open("C:\Assets\Moodbrew Logo and Emojis\MANAGER_inventory_list_btn.png")
    imgy = imgx.resize((360, 90))
    imgInvL = ImageTk.PhotoImage(imgy)
    imgxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\MANAGER_manage_employee_accounts_btn.png")
    imgyy = imgxx.resize((360, 90))
    imgMEE = ImageTk.PhotoImage(imgyy)
    imgxxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\MANAGER_edit_inventory_overview_btn.png")
    imgyyy = imgxxx.resize((360, 90))
    imgEII = ImageTk.PhotoImage(imgyyy)
    imgxxxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\MANAGER_order_history_btn.png")
    imgyyyy = imgxxxx.resize((360, 90))
    imgOH = ImageTk.PhotoImage(imgyyyy)
    imgxxxxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\MANAGER_reports_to_be_generated_btn.png")
    imgyyyyy = imgxxxxx.resize((360, 90))
    imgREP = ImageTk.PhotoImage(imgyyyyy)
    imglogoutx = Image.open("C:\Assets\Moodbrew Logo and Emojis\LOGOUT.png")
    imglogouty = imglogoutx.resize((360, 90))
    imgLOG = ImageTk.PhotoImage(imglogouty)

    btn1 = tk.Button(login_window, image=imgInvL, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=loadingVIManager)
    btn2 = tk.Button(login_window, image=imgMEE, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=loadingEManager)
    btn3 = tk.Button(login_window, image=imgEII, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=loadingItemsManager)
    btn4 = tk.Button(login_window, image=imgOH, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=loadingOHManager)
    btn5 = tk.Button(login_window, image=imgREP, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=loadingRGManager)
    btn6 = tk.Button(login_window, image=imgLOG, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=confirm_logout)

    btn1.place(x=50, y=80)
    btn2.place(x=50, y=180)
    btn3.place(x=50, y=280)
    btn4.place(x=50, y=380)
    btn5.place(x=50, y=480)
    btn6.place(x=50, y=580)

    btn1.bind("<Enter>", enlarge_button)
    btn1.bind("<Leave>", shrink_button)
    btn2.bind("<Enter>", enlarge_button)
    btn2.bind("<Leave>", shrink_button)
    btn3.bind("<Enter>", enlarge_button)
    btn3.bind("<Leave>", shrink_button)
    btn4.bind("<Enter>", enlarge_button)
    btn4.bind("<Leave>", shrink_button)
    btn5.bind("<Enter>", enlarge_button)
    btn5.bind("<Leave>", shrink_button)
    btn6.bind("<Enter>", enlarge_button)
    btn6.bind("<Leave>", shrink_button)


# ------------------------



def reportsGen():
    global imgInvL, imgMEE, imgBCK

    for widget in login_window.winfo_children():
        widget.destroy()

    login_window.title("Mood Brew - Manager Portal")

    bg_path = r"C:\Assets\MoodBrewBG\homepagebgM.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    if "Jua" in font.families():
        jua_font_large = font.Font(family="Jua", size=24)
        jua_font_medium = font.Font(family="Jua", size=20)
    else:
        jua_font_large = font.Font(family="Helvetica", size=24)
        jua_font_medium = font.Font(family="Helvetica", size=20)

    time_label = tk.Label(login_window, font=font.Font(family="Lato", size=16), bg="#FEF8FA", fg="black")
    time_label.place(x=555, y=15)
    update_time(time_label)

    imgx = Image.open("C:\Assets\Moodbrew Logo and Emojis\grg customer_feedback_btn.png")
    imgy = imgx.resize((360, 90))
    imgInvL = ImageTk.PhotoImage(imgy)
    imgxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\grg total_sales_btn.png")
    imgyy = imgxx.resize((360, 90))
    imgMEE = ImageTk.PhotoImage(imgyy)
    imgbck = Image.open("C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)

    btn1 = tk.Button(login_window, image=imgInvL, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=feedbacks)
    btn2 = tk.Button(login_window, image=imgMEE, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=total_sales)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=backkk_manager)
    
    btn1.place(x=50, y=240)
    btn2.place(x=50, y=350)
    btnBack.place(x=50, y=600)

    btn1.bind("<Enter>", enlarge_button)
    btn1.bind("<Leave>", shrink_button)
    btn2.bind("<Enter>", enlarge_button)
    btn2.bind("<Leave>", shrink_button)

def feedbacks ():
    global login_window, bg_photo, imgBCK, scrollable_frame

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)

    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")

    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(
            scrollregion=canvas.bbox("all")
        )
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    feedbacks = fetch_feedbacks()

    buttons_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
    buttons_frame.pack(fill="x", padx=10, pady=5)

    for idx, feedback in enumerate(feedbacks):
        row = idx // 3
        col = idx % 3

        delete_button = tk.Button(buttons_frame, text=f"Delete Feedback {idx+1}", command=lambda f=feedback: delete_feedback(f["_id"]), bg="red", fg="white", font=("Arial", 18, "bold"))
        delete_button.grid(row=row, column=col, padx=10, pady=5, sticky="nsew")

        feedback_text = f"FEEDBACK {idx + 1}\n\n"
        feedback_text += f"NAME: {feedback['name']}\n"
        feedback_text += f"FEEDBACK:\n      '{feedback['feedback']}'\n\n"
        feedback_text += f"TIME: {feedback['timestamp']}\n\n-----------------\n"

        feedback_label = tk.Label(scrollable_frame, text=feedback_text, bg="#fcd7e5", justify="left", anchor="w", font=("Arial", 24, "bold"), wraplength=920)
        feedback_label.pack(fill="x", padx=10, pady=5)

    for i in range(3):
        buttons_frame.grid_columnconfigure(i, weight=1)

    imgbck = Image.open("C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=reportsGen)
    btnBack.place(x=50, y=600)

    def delete_feedback(feedback_id):
        confirmation = messagebox.askquestion("Delete Feedback", f"Do you want to delete this feedback?")

        if confirmation == 'yes':
            try:
                url = f"https://moodbrew-server.onrender.com/collection/feedbacks/{feedback_id}"
                print(f"Deleting URL: {url}")
                response = requests.delete(url)

                if response.status_code == 200:
                    print(f"Feedback {feedback_id} deleted successfully")
                    refresh_feedbacks()
                else:
                    print(f"Failed to delete Feedback {feedback_id}: {response.status_code}, {response.text}")
                    messagebox.showerror("Error", f"Failed to delete Feedback {feedback_id}")
            except Exception as e:
                print(f"Error deleting feedback {feedback_id}: {e}")
                messagebox.showerror("Error", f"Error deleting feedback {feedback_id}: {e}")
        else:
            print("Feedback deletion cancelled.")

    def refresh_feedbacks():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()

        feedbacks = fetch_feedbacks()

        buttons_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
        buttons_frame.pack(fill="x", padx=10, pady=5)

        for idx, feedback in enumerate(feedbacks):
            row = idx // 3
            col = idx % 3

            delete_button = tk.Button(buttons_frame, text=f"Delete Feedback {idx+1}", command=lambda f=feedback: delete_feedback(f["_id"]), bg="red", fg="white", font=("Arial", 18, "bold"))
            delete_button.grid(row=row, column=col, padx=10, pady=5, sticky="nsew")

            feedback_text = f"FEEDBACK {idx + 1}\n\n"
            feedback_text += f"NAME: {feedback['name']}\n"
            feedback_text += f"FEEDBACK:\n      '{feedback['feedback']}'\n\n"
            feedback_text += f"TIME: {feedback['timestamp']}\n\n-----------------\n"

            feedback_label = tk.Label(scrollable_frame, text=feedback_text, bg="#fcd7e5", justify="left", anchor="w", font=("Arial", 24, "bold"), wraplength=920)
            feedback_label.pack(fill="x", padx=10, pady=5)

        for i in range(3):
            buttons_frame.grid_columnconfigure(i, weight=1)


#--------------------------------------

def total_sales():

    global imgMEE, imgBCK
    global bg_photo, imgBCK, scrollable_frame

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\EMPLOYEE_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    time_label = tk.Label(login_window, font=font.Font(family="Lato", size=16), bg="#FEF8FA", fg="black")
    time_label.place(x=555, y=15)
    update_time(time_label)

    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)

    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")

    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(
            scrollregion=canvas.bbox("all")
        )
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    users = fetch_totalsales()

    total_sales_day = 0
    total_sales_week = 0
    total_sales_month = 0

    sales_by_employee = {}

    today = datetime.datetime.today()
    start_of_week = today - datetime.timedelta(days=today.weekday())
    start_of_month = today.replace(day=1)

    for user in users:
        employee = user.get("employee", "Unknown")
        total = user.get("totalPrice", 0)
        timestamp = datetime.datetime.strptime(user.get("time", ""), "%m/%d/%Y, %I:%M:%S %p")

        sales_by_employee[employee] = sales_by_employee.get(employee, {
            "total": 0,
            "day": 0,
            "week": 0,
            "month": 0
        })
        sales_by_employee[employee]["total"] += total

        if timestamp.date() == today.date():
            sales_by_employee[employee]["day"] += total
            total_sales_day += total

        if start_of_week.date() <= timestamp.date() <= today.date():
            sales_by_employee[employee]["week"] += total
            total_sales_week += total

        if start_of_month.month == timestamp.month and start_of_month.year == timestamp.year:
            sales_by_employee[employee]["month"] += total
            total_sales_month += total

    sorted_employees = sorted(sales_by_employee.items(), key=lambda x: x[1]["total"], reverse=True)

    summary_label = tk.Label(
        scrollable_frame,
        text=f"Total Sales This Day: ₱{total_sales_day}\nTotal Sales This Week: ₱{total_sales_week}\nTotal Sales This Month: ₱{total_sales_month}\n\n",
        bg="#fcd7e5",
        font=("Arial", 24, "bold"),
        justify="left",
        anchor="w"
    )
    summary_label.pack(fill="x", padx=10, pady=10)

    for name, sales in sorted_employees:
        display_text = f"Name: {name}\n"
        display_text += f"Sales this Day: ₱{sales['day']}\nSales this Week: ₱{sales['week']}\nSales this Month: ₱{sales['month']}\n-----------------\n"

        user_label = tk.Label(
            scrollable_frame,
            text=display_text,
            bg="#fcd7e5",
            justify="left",
            anchor="w",
            font=("Arial", 24, "bold"),
            wraplength=920
        )
        user_label.pack(fill="x", padx=10, pady=5)

    imgbck = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0,
                        highlightthickness=0, highlightbackground="black", command=reportsGen)
    btnBack.place(x=50, y=600)



#--------------------------------------



def inventory_list():
    stocksNote()

    global imgInvL, imgMEE, imgBCK

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\homepagebgM.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    if "Jua" in font.families():
        jua_font_large = font.Font(family="Jua", size=27)
        jua_font_medium = font.Font(family="Jua", size=20)
    else:
        jua_font_large = font.Font(family="Helvetica", size=27)
        jua_font_medium = font.Font(family="Helvetica", size=20)


    time_label = tk.Label(login_window, font=font.Font(family="Lato", size=16), bg="#FEF8FA", fg="black")
    time_label.place(x=555, y=15)
    update_time(time_label)

    imgx = Image.open("C:\Assets\Moodbrew Logo and Emojis\ingredients_btn.png")
    imgy = imgx.resize((360, 90))
    imgInvL = ImageTk.PhotoImage(imgy)
    imgxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\materials_btn.png")
    imgyy = imgxx.resize((360, 90))
    imgMEE = ImageTk.PhotoImage(imgyy)
    imgxxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyy = imgxxx.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyy)
    btn1 = tk.Button(login_window, image=imgInvL, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=ingreds)
    btn2 = tk.Button(login_window, image=imgMEE, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=materials)
    btn3 = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=backkk_manager)
    
    btn1.place(x=50, y=230)
    btn2.place(x=50, y=390)
    btn3.place(x=50, y=600)

    btn1.bind("<Enter>", enlarge_button)
    btn1.bind("<Leave>", shrink_button)
    btn2.bind("<Enter>", enlarge_button)
    btn2.bind("<Leave>", shrink_button)


def ingreds():

    global bg_photo, imgBCK, scrollable_frame
    
    for widget in login_window.winfo_children():
        widget.destroy()
    
    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return
    
    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)
    
    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)
    
    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")
    
    scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
    
    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    scrollable_frame.update_idletasks()
    canvas.config(scrollregion=canvas.bbox("all"))
  
    def refresh_ingredients():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()
        headers = ["Name", "Quantity", "Unit", "Perishable?", "Note"]
        header_widths = [7, 8, 5, 10, 27]
        cell_widths = [15, 8, 8, 10, 27]
        wrap_lengths = [150, 100, 100, 100, 250]
        for col, header in enumerate(headers):
            header_label = tk.Label(scrollable_frame, text=header, bg="#fcd7e5", font=("Arial", 20, "bold"), anchor="w", width=header_widths[col])
            header_label.grid(row=0, column=col, padx=5, pady=10, sticky="w")
        ingredients = [item for item in fetch_inventory() if item.get("type") == "ingredient"]
        for idx, item in enumerate(ingredients, start=1):
            values = [
                item.get("name", ""),
                str(item.get("quantity", "")),
                item.get("unit", ""),
                str(item.get("perishable", "")),
                item.get("note", "")
            ]
            for col, value in enumerate(values):
                cell = tk.Label(scrollable_frame, text=value, bg="#fce4ec", font=("Arial", 16), anchor="w", width=cell_widths[col], justify="left", wraplength=wrap_lengths[col])
                cell.grid(row=idx, column=col, padx=5, pady=5, sticky="w")
        for col in range(len(headers)):
            scrollable_frame.grid_columnconfigure(col, weight=1)
    
    refresh_ingredients()
    
    imgbck = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=inventory_list)
    btnBack.place(x=50, y=600)



def materials():

    global bg_photo, imgBCK, scrollable_frame
    
    for widget in login_window.winfo_children():
        widget.destroy()
    
    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return
    
    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)
    
    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)
    
    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")
    
    scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
    
    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    scrollable_frame.update_idletasks()
    canvas.config(scrollregion=canvas.bbox("all"))
  
    def refresh_ingredients():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()
        headers = ["Name", "Quantity", "Unit", "Note"]
        header_widths = [7, 8, 5, 27]
        cell_widths = [15, 8, 8, 27]
        wrap_lengths = [150, 100, 100, 250]
        for col, header in enumerate(headers):
            header_label = tk.Label(scrollable_frame, text=header, bg="#fcd7e5", font=("Arial", 20, "bold"), anchor="w", width=header_widths[col])
            header_label.grid(row=0, column=col, padx=5, pady=10, sticky="w")
        ingredients = [item for item in fetch_inventory() if item.get("type") == "material"]
        for idx, item in enumerate(ingredients, start=1):
            values = [
                item.get("name", ""),
                str(item.get("quantity", "")),
                item.get("unit", ""),
                item.get("note", "")
            ]
            for col, value in enumerate(values):
                cell = tk.Label(scrollable_frame, text=value, bg="#fce4ec", font=("Arial", 16), anchor="w", width=cell_widths[col], justify="left", wraplength=wrap_lengths[col])
                cell.grid(row=idx, column=col, padx=5, pady=5, sticky="w")
        for col in range(len(headers)):
            scrollable_frame.grid_columnconfigure(col, weight=1)
    
    refresh_ingredients()
    
    imgbck = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=inventory_list)
    btnBack.place(x=50, y=600)



# ------------------------



def editEmployees(emp_id):
    
    global imgInvL, imgMEE

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path).resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    if "Jua" in font.families():
        jua_font_large = font.Font(family="Arial", size=27, weight="bold")
        jua_font_medium = font.Font(family="Arial", size=20, weight="bold")
        jua_font_small = font.Font(family="Arial", size=16, weight="bold")
    else:
        jua_font_large = font.Font(family="Helvetica", size=27)
        jua_font_medium = font.Font(family="Helvetica", size=20)
        jua_font_small = font.Font(family="Helvetica", size=16)

    time_label = tk.Label(login_window, font=font.Font(family="Lato", size=16), bg="#FEF8FA", fg="black")
    time_label.place(x=555, y=15)
    update_time(time_label)

    photo_frame = tk.Frame(login_window, bg="#f8ece4", width=200, height=200, relief="ridge", bd=5)
    photo_frame.place(x=120, y=130)

    photo_button = tk.Button(
        login_window, text="Upload", font=jua_font_small,
        bg="white", fg="black", command=lambda: uploadRemovephoto(photo_frame, photo_button)
    )
    photo_button.place(x=180, y=340)

    textboxes_frame = tk.Frame(login_window, bg="#f8ece4", width=400, height=300, relief="ridge", bd=5)
    textboxes_frame.place(x=370, y=130)

    fields = ["Name", "Age", "Address", "Email"]

    name_entry = tk.Entry(textboxes_frame, font=jua_font_small, bg="white", fg="black", width=30)
    age_entry = tk.Entry(textboxes_frame, font=jua_font_small, bg="white", fg="black", width=30)
    address_entry = tk.Entry(textboxes_frame, font=jua_font_small, bg="white", fg="black", width=30)
    email_entry = tk.Entry(textboxes_frame, font=jua_font_small, bg="white", fg="black", width=30)

    for idx, field in enumerate(fields):
        tk.Label(textboxes_frame, text=field, font=jua_font_medium, bg="#f8ece4", fg="black").grid(row=idx, column=0, padx=10, pady=10, sticky="w")

    name_entry.grid(row=0, column=1, padx=10, pady=10)
    age_entry.grid(row=1, column=1, padx=10, pady=10)
    address_entry.grid(row=2, column=1, padx=10, pady=10)
    email_entry.grid(row=3, column=1, padx=10, pady=10)

    try:
        url = "https://moodbrew-server.onrender.com/collection/users"
        response = requests.get(url)
        if response.status_code == 200:
            all_users = response.json()
        else:
            messagebox.showerror("Error", "Failed to fetch employee records.")
            return
    except Exception as e:
        messagebox.showerror("Error", f"Error fetching employee data: {e}")
        return

    emp_id_str = emp_id["$oid"] if isinstance(emp_id, dict) else emp_id
    selected_user = next((user for user in all_users if user["_id"] == emp_id_str), None)

    if not selected_user:
        messagebox.showerror("Error", "Employee not found.")
        return

    name_entry.insert(0, selected_user.get("name", ""))
    age_entry.insert(0, str(selected_user.get("age", "")))
    address_entry.insert(0, selected_user.get("address", ""))
    email_entry.insert(0, selected_user.get("email", ""))

    global uploaded_image_b64
    uploaded_image_b64 = selected_user.get("photo", "")
    if uploaded_image_b64:
        try:
            img_data = base64.b64decode(uploaded_image_b64)
            img = Image.open(io.BytesIO(img_data)).resize((180, 180), Image.LANCZOS)
            photo = ImageTk.PhotoImage(img)
            label = tk.Label(photo_frame, image=photo, bg="#f8ece4")
            label.image = photo
            label.pack()

            global profile_photo
            profile_photo = photo

        except Exception as e:
            print("Error loading photo:", e)

    def toggle_password():
        if password_entry.cget("show") == "*":
            password_entry.config(show="")
            toggle_button.config(text="Hide")
        else:
            password_entry.config(show="*")
            toggle_button.config(text="Show")

    password_frame = tk.Frame(login_window, bg="#f8ece4", width=400, height=100, relief="ridge", bd=5)
    password_frame.place(x=370, y=370)

    tk.Label(password_frame, text="Password", font=jua_font_medium, bg="#f8ece4", fg="black").grid(row=0, column=0, padx=10, pady=10, sticky="w")
    password_entry = tk.Entry(password_frame, font=jua_font_small, bg="white", fg="black", width=24, show="*")
    password_entry.insert(0, selected_user.get("password", ""))
    password_entry.grid(row=0, column=1, padx=10, pady=10)

    toggle_button = tk.Button(login_window, text="Show", command=toggle_password, font=jua_font_small, bg="white", fg="black")
    toggle_button.place(x=860, y=385)

    password_strength_label = tk.Label(login_window, text="Password Strength: Weak", font=jua_font_large, bg="#f8ece4", fg="red")
    password_strength_label.place(x=370, y=460)

    def check_password_strength(password):
        if len(password) < 10:
            return "Weak", "red"
        elif len(password) < 18:
            return "Moderate", "orange"
        elif re.search(r"\d", password) and re.search(r"[A-Za-z]", password) and re.search(r"[A-Za-z0-9]", password):
            return "Strong", "green"
        else:
            return "Moderate", "orange"

    def update_password_strength(event=None):
        password = password_entry.get()  
        strength, color = check_password_strength(password) 
        password_strength_label.config(text=f"Password Strength: {strength}", fg=color)

    password_entry.bind("<KeyRelease>", update_password_strength)

    imgx = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\gapply_changes.png").resize((340, 85))
    imgInvL = ImageTk.PhotoImage(imgx)
    imgxx = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\cancel_btn.png").resize((210, 60))
    imgMEE = ImageTk.PhotoImage(imgxx)

    def update_employee_to_db():
        name = name_entry.get()
        age = age_entry.get()
        address = address_entry.get()
        email = email_entry.get()
        password = password_entry.get()

        def is_valid_gmail(email):
            return email.endswith("@gmail.com") and email.count("@") == 1 and len(email) > len("@gmail.com")

        if not name or not age or not address or not email or not password:
            messagebox.showerror("Error", "All fields must be filled out.")
            return

        if not is_valid_gmail(email):
            messagebox.showerror("Error", "Email must be a valid Gmail address ending with '@gmail.com'.")
            return

        try:
            age = int(age)
            if age < 0:
                raise ValueError
        except ValueError:
            messagebox.showerror("Error", "Age must be a whole valid number (positive)")
            return

        if not uploaded_image_b64:
            messagebox.showerror("Error", "Please upload a photo before proceeding.")
            return
        
        confirm_window = tk.Toplevel(login_window)
        confirm_window.title("Confirm")
        confirm_window.geometry("400x500")
        confirm_window.resizable(False, False)
        confirm_window.iconbitmap(r"C:\Assets\MoodBrewBG\icon.ico")

        tk.Label(confirm_window, text="Confirm Updated Details:", font=jua_font_medium).pack(pady=10)

        img_data = base64.b64decode(uploaded_image_b64)
        img = Image.open(io.BytesIO(img_data)).resize((150, 150), Image.LANCZOS)
        photo = ImageTk.PhotoImage(img)

        img_label = tk.Label(confirm_window, image=photo)
        img_label.image = photo
        img_label.pack(pady=10)

        info = f"Name: {name}\nAge: {age}\nAddress: {address}\nEmail: {email}\nPassword: {password}"
        tk.Label(confirm_window, text=info, font=jua_font_small, justify="left").pack(pady=10)

        def confirm_update():
            try:
                updated_employee = {
                "name": name,
                "email": email,
                "password": password,
                "age": int(age),
                "address": address,
                "photo": uploaded_image_b64
                }
                response = requests.put(f"https://moodbrew-server.onrender.com/collection/users/{emp_id}", json=updated_employee)
                if 200 <= response.status_code < 300:
                    messagebox.showinfo("Success", "Employee updated successfully!")
                    confirm_window.destroy()
                    manage_employee_accounts()
                else:
                    messagebox.showerror("Error", "Failed to update employee.")
            except Exception as e:
                messagebox.showerror("Error", f"An error occurred: {e}")

        confirm_button = tk.Button(confirm_window, text="Confirm Update", font=jua_font_small, bg="green", fg="white", command=confirm_update)
        confirm_button.pack(pady=10)

    btn1 = tk.Button(login_window, image=imgInvL, width=340, height=85, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=update_employee_to_db)
    btn2 = tk.Button(login_window, image=imgMEE, width=210, height=60, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=manage_employee_accounts)

    btn1.place(x=670, y=550)
    btn2.place(x=70, y=560)

    btn1.bind("<Enter>", lambda e: btn1.config(cursor="hand2"))
    btn1.bind("<Leave>", lambda e: btn1.config(cursor="arrow"))
    btn2.bind("<Enter>", lambda e: btn2.config(cursor="hand2"))
    btn2.bind("<Leave>", lambda e: btn2.config(cursor="arrow"))


def Archive():
    global login_window, bg_photo, imgBCK

    if 'login_window' in globals() and login_window.winfo_exists():
        for widget in login_window.winfo_children():
            widget.destroy()
    else:
        login_window = tk.Tk()
        login_window.title("Mood Brew")
        login_window.geometry("1064x709")
        login_window.resizable(False, False)
        login_window.iconbitmap(r"C:\Assets\MoodBrewBG\icon.ico")

    login_window.title("Mood Brew - Archive")

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    warning_label = tk.Label(
        login_window,
        text="Accounts in this will be automatically deleted after 15 days if not recovered.\nClick on the button to recover an employee",
        font=("Arial", 16, "bold"),
        bg="#ffeff2",
        fg="black",
        justify="center"
    )
    warning_label.place(x=100, y=70)

    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=70, y=130, width=670, height=480)

    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")

    scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    try:
        response = requests.get("https://moodbrew-server.onrender.com/collection/archive")
        if response.status_code == 200:
            all_archived = response.json()
        else:
            all_archived = []
    except Exception as e:
        all_archived = []

    buttons_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
    buttons_frame.pack(fill="x", padx=20, pady=5)

    def recover_employee(emp_id, name):
        confirm = messagebox.askyesno("Recover Confirmation", f"Do you want to recover {name}?")
        if not confirm:
            return
      
        emp_id = ObjectId(emp_id) if isinstance(emp_id, str) else emp_id
        
        try:
            user_response = requests.get("https://moodbrew-server.onrender.com/collection/archive")
            if user_response.status_code != 200:
                messagebox.showerror("Error", "Failed to retrieve employee data.")
                return

            all_users = user_response.json()

            employee_data = next((u for u in all_users if ObjectId(u.get("_id")) == emp_id), None)
            if not employee_data:
                messagebox.showerror("Error", "Employee not found.")
                return
            
            employee_data.pop("_id", None)
            employee_data.pop("createdAt", None)

            insert_response = requests.post("https://moodbrew-server.onrender.com/collection/users", json=employee_data)
            if not (200 <= insert_response.status_code < 300):
                messagebox.showerror("Error", "Failed to restore employee.")
                return

            delete_response = requests.delete(f"https://moodbrew-server.onrender.com/collection/archive/{str(emp_id)}")

            if 200 <= delete_response.status_code < 300:
                Archive()
            else:
                print(f"Delete response: {delete_response.status_code}, {delete_response.text}")
                messagebox.showerror("Error", "Failed to remove employee from archive.")
        except Exception as e:
            messagebox.showerror("Error", f"Unexpected error: {e}")

    for idx, employee in enumerate(all_archived):
        row = idx // 2
        col = idx % 2
        emp_id = employee.get("_id")
        emp_name = employee.get("name", "Unknown")

        wrapper = tk.Frame(buttons_frame, bg="#fcd7e5")
        wrapper.grid(row=row, column=col, padx=10, pady=10, sticky="nsew")

        emp_shadow = tk.Label(wrapper, bg="gray", width=22, height=2)
        emp_shadow.place(x=10 + 7, y=10 + 7)

        emp_button = tk.Button(
            wrapper,
            text=emp_name,
            bg="#28a745",
            fg="white",
            font=("Arial", 16, "bold"),
            width=20,
            height=2,
            command=lambda emp_id=emp_id, name=emp_name: recover_employee(emp_id, name)
        )
        emp_button.pack(pady=(10, 0))

    for col in range(2):
        buttons_frame.grid_columnconfigure(col, weight=1)

    imgxxx = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyy = imgxxx.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyy)

    btn2 = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0,
                     highlightthickness=0, highlightbackground="black", command=manage_employee_accounts)
    
    btn2.place(x=770, y=550)


def manage_employee_accounts():
    
    global login_window, jua_font_medium, imgMEE, imgBCK, bg_photo

    if 'login_window' in globals() and login_window.winfo_exists():
        for widget in login_window.winfo_children():
            widget.destroy()
    else:
        login_window = tk.Tk()
        login_window.title("Mood Brew")
        login_window.geometry("1064x709")
        login_window.resizable(False, False)
        login_window.iconbitmap(r"C:\Assets\MoodBrewBG\icon.ico")

    def delete_employee(emp_id, name):
        confirm = messagebox.askyesno("Delete Confirmation", f"Are you sure you want to delete employee: {name}?")
        if not confirm:
            return

        try:

            user_response = requests.get("https://moodbrew-server.onrender.com/collection/users")
            if user_response.status_code != 200:
                messagebox.showerror("Error", "Failed to retrieve employee data.")
                return

            all_users = user_response.json()
            employee_data = next((u for u in all_users if u.get("_id") == emp_id), None)
            if not employee_data:
                messagebox.showerror("Error", "Employee not found.")
                return

            employee_data.pop("_id", None)

            archive_response = requests.post("https://moodbrew-server.onrender.com/collection/archive", json=employee_data)
            if not (200 <= archive_response.status_code < 300):
                messagebox.showerror("Error", "Failed to archive employee data.")
                return

            delete_response = requests.delete(f"https://moodbrew-server.onrender.com/collection/users/{emp_id}")
            if 200 <= delete_response.status_code < 300:
                manage_employee_accounts()
            else:
                messagebox.showerror("Error", "Failed to delete employee from users database.")

        except Exception as e:
            messagebox.showerror("Error", f"Unexpected error: {e}")

    login_window.title("Mood Brew - Manager Portal")

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    if "Jua" in font.families():
        jua_font_large = font.Font(family="Jua", size=27)
        jua_font_medium = font.Font(family="Jua", size=20)
    else:
        jua_font_large = font.Font(family="Helvetica", size=27)
        jua_font_medium = font.Font(family="Helvetica", size=20)

    time_label = tk.Label(login_window, font=font.Font(family="Lato", size=16), bg="#FEF8FA", fg="black")
    time_label.place(x=555, y=15)
    update_time(time_label)

    imgxx = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\gadd_an_employee_btn.png")
    imgyy = imgxx.resize((360, 90))
    imgMEE = ImageTk.PhotoImage(imgyy)

    imgxxx = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyy = imgxxx.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyy)

    btn1 = tk.Button(login_window, image=imgMEE, width=360, height=90, fg="black", bd=0,
                     highlightthickness=0, highlightbackground="black", command=addEmployees)
    btn2 = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0,
                     highlightthickness=0, highlightbackground="black", command=backkk_manager)
    btn3 = tk.Button(login_window, text="Archive", width=10, height=2, 
                 fg="white", bg="gray", bd=0,
                 font=("Arial", 18, "bold"),  
                 highlightthickness=0, highlightbackground="black", command=Archive)

    btn1.place(x=75, y=80)
    btn2.place(x=770, y=550)
    btn3.place(x=775, y=90)

    btn1.bind("<Enter>", enlarge_button)
    btn1.bind("<Leave>", shrink_button)

    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=70, y=190, width=670, height=420)

    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")

    scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    try:
        url = "https://moodbrew-server.onrender.com/collection/users"
        response = requests.get(url)
        if response.status_code == 200:
            all_users = response.json()
        else:
            all_users = []
    except Exception as e:
        all_users = []

    employees = [user for user in all_users if user.get("usertype") == 2]

    buttons_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
    buttons_frame.pack(fill="x", padx=20, pady=5)

    for idx, employee in enumerate(employees):
        row = idx // 2
        col = idx % 2
        emp_id = employee.get("_id")
        emp_name = employee.get("name", "Unknown")

        wrapper = tk.Frame(buttons_frame, bg="#fcd7e5")
        wrapper.grid(row=row, column=col, padx=10, pady=10, sticky="nsew")

        emp_shadow = tk.Label(
            wrapper,
            bg="gray", 
            width=22,
            height=2
        )
        emp_shadow.place(x=10 + 7, y=10 + 7)
        emp_button = tk.Button(
            wrapper,
            text=emp_name,
            bg="#2848ff",
            fg="white",
            font=("Arial", 16, "bold"),
            width=20,
            height=2,
            command=lambda emp_id=emp_id: editEmployees(emp_id)
        )
        emp_button.pack(pady=(10, 0))

        
        x_button = tk.Button(
            wrapper,
            text="X",
            bg="red",
            fg="white",
            font=("Arial", 10, "bold"),
            width=2,
            height=1,
            bd=0,
            command=lambda emp_id=emp_id, name=emp_name: delete_employee(emp_id, name)
        )
        x_button.place(relx=1, y=0, anchor="ne")

    for col in range(2):
        buttons_frame.grid_columnconfigure(col, weight=1)


def addEmployees():
    global imgInvL, imgMEE

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path).resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    if "Jua" in font.families():
        jua_font_large = font.Font(family="Arial", size=27, weight="bold")
        jua_font_medium = font.Font(family="Arial", size=20, weight="bold")
        jua_font_small = font.Font(family="Arial", size=16, weight="bold")
    else:
        jua_font_large = font.Font(family="Helvetica", size=27)
        jua_font_medium = font.Font(family="Helvetica", size=20)
        jua_font_small = font.Font(family="Helvetica", size=16)

    time_label = tk.Label(login_window, font=font.Font(family="Lato", size=16), bg="#FEF8FA", fg="black")
    time_label.place(x=555, y=15)
    update_time(time_label)

    photo_frame = tk.Frame(login_window, bg="#f8ece4", width=200, height=200, relief="ridge", bd=5)
    photo_frame.place(x=120, y=130)

    photo_button = tk.Button(
        login_window, text="Upload", font=jua_font_small,
        bg="white", fg="black", command=lambda: uploadRemovephoto(photo_frame, photo_button)
    )
    photo_button.place(x=180, y=340)

    textboxes_frame = tk.Frame(login_window, bg="#f8ece4", width=400, height=300, relief="ridge", bd=5)
    textboxes_frame.place(x=370, y=130)

    fields = ["Name", "Age", "Address", "Email"]

    name_entry = tk.Entry(textboxes_frame, font=jua_font_small, bg="white", fg="black", width=30)
    age_entry = tk.Entry(textboxes_frame, font=jua_font_small, bg="white", fg="black", width=30)
    address_entry = tk.Entry(textboxes_frame, font=jua_font_small, bg="white", fg="black", width=30)
    email_entry = tk.Entry(textboxes_frame, font=jua_font_small, bg="white", fg="black", width=30)

    for idx, field in enumerate(fields):
        tk.Label(textboxes_frame, text=field, font=jua_font_medium, bg="#f8ece4", fg="black").grid(row=idx, column=0, padx=10, pady=10, sticky="w")

    name_entry.grid(row=0, column=1, padx=10, pady=10)
    age_entry.grid(row=1, column=1, padx=10, pady=10)
    address_entry.grid(row=2, column=1, padx=10, pady=10)
    email_entry.grid(row=3, column=1, padx=10, pady=10)

    def toggle_password():
        if password_entry.cget("show") == "*":
            password_entry.config(show="")
            toggle_button.config(text="Hide")
        else:
            password_entry.config(show="*")
            toggle_button.config(text="Show")

    password_frame = tk.Frame(login_window, bg="#f8ece4", width=400, height=100, relief="ridge", bd=5)
    password_frame.place(x=370, y=370)

    tk.Label(password_frame, text="Password", font=jua_font_medium, bg="#f8ece4", fg="black").grid(row=0, column=0, padx=10, pady=10, sticky="w")
    password_entry = tk.Entry(password_frame, font=jua_font_small, bg="white", fg="black", width=24, show="*")
    password_entry.grid(row=0, column=1, padx=10, pady=10)

    toggle_button = tk.Button(login_window, text="Show", command=toggle_password, font=jua_font_small, bg="white", fg="black")
    toggle_button.place(x=860, y=385)

    password_strength_label = tk.Label(login_window, text="Password Strength: Weak", font=jua_font_large, bg="#f8ece4", fg="red")
    password_strength_label.place(x=370, y=460)

    def check_password_strength(password):
        """Check the strength of the password"""
        if len(password) < 10:
            return "Weak", "red"
        elif len(password) < 18:
            return "Moderate", "orange"
        elif re.search(r"\d", password) and re.search(r"[A-Za-z]", password) and re.search(r"[A-Za-z0-9]", password):
            return "Strong", "green"
        else:
            return "Moderate", "orange"

    def update_password_strength(event=None):
        password = password_entry.get()  
        strength, color = check_password_strength(password) 
        password_strength_label.config(text=f"Password Strength: {strength}", fg=color)


    password_entry.bind("<KeyRelease>", update_password_strength)

    imgx = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\gapply_changes.png").resize((340, 85))
    imgInvL = ImageTk.PhotoImage(imgx)
    imgxx = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\cancel_btn.png").resize((210, 60))
    imgMEE = ImageTk.PhotoImage(imgxx)

    def add_employee_to_db():
        name = name_entry.get()
        age = age_entry.get()
        address = address_entry.get()
        email = email_entry.get()
        password = password_entry.get()

        def is_valid_gmail(email):
            return email.endswith("@gmail.com") and email.count("@") == 1 and len(email) > len("@gmail.com")

        if not name or not age or not address or not email or not password:
            messagebox.showerror("Error", "All fields must be filled out.")
            return

        if not is_valid_gmail(email):
            messagebox.showerror("Error", "Email must be a valid Gmail address ending with '@gmail.com'.")
            return

        try:
            age = int(age)
            if age < 0:
                raise ValueError
        except ValueError:
            messagebox.showerror("Error", "Age must be a whole valid number (positive)")
            return

        if not uploaded_image_b64:
            messagebox.showerror("Error", "Please upload a photo before proceeding.")
            return

        try:
            url = "https://moodbrew-server.onrender.com/collection/users"
            response = requests.get(url)
            if 200 <= response.status_code < 300:
                all_users = response.json()
                for user in all_users:
                    if user['name'].lower() == name.lower() or user['email'].lower() == email.lower():
                        messagebox.showerror("Duplicate", "Same name or same email already exists.")
                        return
            else:
                messagebox.showerror("Error", "Failed to fetch existing users.")
                return
        except Exception as e:
            messagebox.showerror("Error", f"An error occurred: {e}")
            return

        confirm_window = tk.Toplevel(login_window)
        confirm_window.title("Confirm")
        confirm_window.geometry("400x500")
        confirm_window.resizable(False, False)
        confirm_window.iconbitmap(r"C:\Assets\MoodBrewBG\icon.ico")

        tk.Label(confirm_window, text="Confirm Details:", font=jua_font_medium).pack(pady=10)

        img_data = base64.b64decode(uploaded_image_b64)
        img = Image.open(io.BytesIO(img_data)).resize((150, 150), Image.LANCZOS)
        photo = ImageTk.PhotoImage(img)

        img_label = tk.Label(confirm_window, image=photo)
        img_label.image = photo
        img_label.pack(pady=10)

        info = f"Name: {name}\nAge: {age}\nAddress: {address}\nEmail: {email}\nPassword: {password}"
        tk.Label(confirm_window, text=info, font=jua_font_small, justify="left").pack(pady=10)

        def confirm_add():
            try:
                usertype = 2
                new_employee = {
                    "name": name,
                    "email": email,
                    "password": password,
                    "age": int(age),
                    "address": address,
                    "usertype": usertype,
                    "photo": uploaded_image_b64
                }
                response = requests.post(url, json=new_employee)
                if 200 <= response.status_code < 300:
                    messagebox.showinfo("Success", "Employee added successfully!")
                    confirm_window.destroy()
                    manage_employee_accounts()
                else:
                    messagebox.showerror("Error", "Failed to add employee.")
            except Exception as e:
                messagebox.showerror("Error", f"An error occurred: {e}")

        btn_frame = tk.Frame(confirm_window)
        btn_frame.pack(pady=15)

        tk.Button(btn_frame, text="Confirm", command=confirm_add, bg="green", fg="white", width=10).grid(row=0, column=0, padx=10)
        tk.Button(btn_frame, text="Cancel", command=confirm_window.destroy, bg="red", fg="white", width=10).grid(row=0, column=1, padx=10)

    btn1 = tk.Button(login_window, image=imgInvL, width=340, height=85, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=add_employee_to_db)
    btn2 = tk.Button(login_window, image=imgMEE, width=210, height=60, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=manage_employee_accounts)

    btn1.place(x=670, y=550)
    btn2.place(x=70, y=560)

    btn1.bind("<Enter>", lambda e: btn1.config(cursor="hand2"))
    btn1.bind("<Leave>", lambda e: btn1.config(cursor="arrow"))
    btn2.bind("<Enter>", lambda e: btn2.config(cursor="hand2"))
    btn2.bind("<Leave>", lambda e: btn2.config(cursor="arrow"))


# ------------------------

def removeIngredients():
    
    global bg_photo, imgBCK, scrollable_frame

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)

    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")

    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    def refresh_ingredients():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()

        ingredients = [item for item in fetch_inventory() if item.get("type") == "ingredient"]

        for idx, item in enumerate(ingredients):
            row = idx // 2
            col = idx % 2

            remove_btn = tk.Button(
            scrollable_frame,
            text=f"Remove {item['name']}",
            command=lambda itm=item: delete_ingredient(itm),
            bg="#dc3545",
            fg="white",
            font=("Helvetica", 14, "bold"),
            width=35,
            height=3,
            cursor="hand2",
            relief="flat"
            )
            remove_btn.grid(row=row, column=col, padx=20, pady=15, sticky="nsew")

        for i in range(2):
            scrollable_frame.grid_columnconfigure(i, weight=1)

    def delete_ingredient(item):
        confirm = messagebox.askyesno("Confirm Delete", f"Are you sure you want to delete '{item['name']}'?")
        if not confirm:
            return

        url = f"https://moodbrew-server.onrender.com/collection/inventory/{item['_id']}"
        try:
            response = requests.delete(url)
            if response.status_code == 200:
                messagebox.showinfo("Deleted", f"{item['name']} removed successfully.")
                refresh_ingredients()
            else:
                messagebox.showerror("Error", "Failed to delete ingredient.")
        except Exception as e:
            print("Error deleting ingredient:", e)
            messagebox.showerror("Error", f"Error deleting ingredient: {e}")

    refresh_ingredients()

    imgbck = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black",
                    bd=0, highlightthickness=0, highlightbackground="black", command=edit_inventory_items)
    btnBack.place(x=50, y=600)

def removeMaterials():
    
    global bg_photo, imgBCK, scrollable_frame

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)

    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")

    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    def refresh_ingredients():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()

        ingredients = [item for item in fetch_inventory() if item.get("type") == "material"]

        for idx, item in enumerate(ingredients):
            row = idx // 2
            col = idx % 2

            remove_btn = tk.Button(
            scrollable_frame,
            text=f"Remove {item['name']}",
            command=lambda itm=item: delete_ingredient(itm),
            bg="#dc3545",
            fg="white",
            font=("Helvetica", 14, "bold"),
            width=35,
            height=3,
            cursor="hand2",
            relief="flat"
            )
            remove_btn.grid(row=row, column=col, padx=20, pady=15, sticky="nsew")

        for i in range(2):
            scrollable_frame.grid_columnconfigure(i, weight=1)

    def delete_ingredient(item):
        confirm = messagebox.askyesno("Confirm Delete", f"Are you sure you want to delete '{item['name']}'?")
        if not confirm:
            return

        url = f"https://moodbrew-server.onrender.com/collection/inventory/{item['_id']}"
        try:
            response = requests.delete(url)
            if response.status_code == 200:
                messagebox.showinfo("Deleted", f"{item['name']} removed successfully.")
                refresh_ingredients()
            else:
                messagebox.showerror("Error", "Failed to delete ingredient.")
        except Exception as e:
            print("Error deleting ingredient:", e)
            messagebox.showerror("Error", f"Error deleting ingredient: {e}")

    refresh_ingredients()

    imgbck = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black",
                    bd=0, highlightthickness=0, highlightbackground="black", command=edit_inventory_items)
    btnBack.place(x=50, y=600)

def addIngredients():
    def submit_ingredient():
        name = entry_name.get().strip()
        quantity = entry_quantity.get().strip()
        unit = entry_unit.get().strip()
        perishable = perishable_var.get()

        if not name or not quantity or not unit or not perishable:
            messagebox.showerror("Invalid Input", "All fields must be filled.")
            return

        if not quantity.isdigit() or int(quantity) < 0:
            messagebox.showerror("Invalid Quantity", "Quantity must be a whole number 0 or above.")
            return

        payload = {
            "name": name,
            "quantity": int(quantity),
            "unit": unit,
            "type": "ingredient",
            "perishable": perishable,
        }

        try:
            response = requests.post("https://moodbrew-server.onrender.com/collection/inventory", json=payload)
            if response.status_code == 201:
                messagebox.showinfo("Success", "Ingredient added successfully.")
                popup.destroy()
            else:
                messagebox.showerror("Error", f"Failed to add ingredient. ({response.status_code})")
        except Exception as e:
            print("Error adding ingredient:", e)
            messagebox.showerror("Error", f"Error adding ingredient: {e}")

    popup = tk.Toplevel()
    popup.title("Add Ingredient")
    popup.geometry("400x400")
    popup.configure(bg="#fcd7e5")
    popup.iconbitmap(r"C:\Assets\MoodBrewBG\icon.ico")

    tk.Label(popup, text="Name:", bg="#fcd7e5", font=("Helvetica", 12)).pack(pady=(10, 0))
    entry_name = tk.Entry(popup, font=("Helvetica", 12))
    entry_name.pack(pady=5)

    tk.Label(popup, text="Quantity:", bg="#fcd7e5", font=("Helvetica", 12)).pack()
    entry_quantity = tk.Entry(popup, font=("Helvetica", 12))
    entry_quantity.pack(pady=5)

    tk.Label(popup, text="Unit:", bg="#fcd7e5", font=("Helvetica", 12)).pack()
    entry_unit = tk.Entry(popup, font=("Helvetica", 12))
    entry_unit.pack(pady=5)

    tk.Label(popup, text="Perishable:", bg="#fcd7e5", font=("Helvetica", 12)).pack()
    perishable_var = tk.StringVar(popup)
    perishable_var.set("No")
    option_perishable = tk.OptionMenu(popup, perishable_var, "Yes", "No")
    option_perishable.pack(pady=5)

    tk.Button(popup, text="Add Ingredient", command=submit_ingredient, bg="#28a745", fg="white",
              font=("Helvetica", 12, "bold"), padx=10, pady=5).pack(pady=10)


def addMaterials():
    def submit_ingredient():
        name = entry_name.get().strip()
        quantity = entry_quantity.get().strip()
        unit = entry_unit.get().strip()
        
        if not name or not quantity or not unit:
            messagebox.showerror("Invalid Input", "All fields must be filled.")
            return

        if not quantity.isdigit() or int(quantity) < 0:
            messagebox.showerror("Invalid Quantity", "Quantity must be a whole number 0 or above.")
            return

        payload = {
            "name": name,
            "quantity": int(quantity),
            "unit": unit,
            "type": "material",
        }

        try:
            response = requests.post("https://moodbrew-server.onrender.com/collection/inventory", json=payload)
            if response.status_code == 201:
                messagebox.showinfo("Success", "Material added successfully.")
                popup.destroy()
            else:
                messagebox.showerror("Error", f"Failed to add ingredient. ({response.status_code})")
        except Exception as e:
            print("Error adding ingredient:", e)
            messagebox.showerror("Error", f"Error adding ingredient: {e}")

    popup = tk.Toplevel()
    popup.title("Add Material")
    popup.geometry("400x400")
    popup.configure(bg="#fcd7e5")
    popup.iconbitmap(r"C:\Assets\MoodBrewBG\icon.ico")

    tk.Label(popup, text="Name:", bg="#fcd7e5", font=("Helvetica", 12)).pack(pady=(10, 0))
    entry_name = tk.Entry(popup, font=("Helvetica", 12))
    entry_name.pack(pady=5)

    tk.Label(popup, text="Quantity:", bg="#fcd7e5", font=("Helvetica", 12)).pack()
    entry_quantity = tk.Entry(popup, font=("Helvetica", 12))
    entry_quantity.pack(pady=5)

    tk.Label(popup, text="Unit:", bg="#fcd7e5", font=("Helvetica", 12)).pack()
    entry_unit = tk.Entry(popup, font=("Helvetica", 12))
    entry_unit.pack(pady=5)

    tk.Button(popup, text="Add Material", command=submit_ingredient, bg="#28a745", fg="white",
              font=("Helvetica", 12, "bold"), padx=10, pady=5).pack(pady=10)


def edit_inventory_items():
    
    global imgInvL, imgMEE, imgBCK

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\homepagebgM.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    if "Jua" in font.families():
        jua_font_large = font.Font(family="Jua", size=27)
        jua_font_medium = font.Font(family="Jua", size=20)
    else:
        jua_font_large = font.Font(family="Helvetica", size=27)
        jua_font_medium = font.Font(family="Helvetica", size=20)


    time_label = tk.Label(login_window, font=font.Font(family="Lato", size=16), bg="#FEF8FA", fg="black")
    time_label.place(x=555, y=15)
    update_time(time_label)

    imgx = Image.open("C:\Assets\Moodbrew Logo and Emojis\ingredients_btn.png")
    imgy = imgx.resize((360, 90))
    imgInvL = ImageTk.PhotoImage(imgy)
    imgxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\materials_btn.png")
    imgyy = imgxx.resize((360, 90))
    imgMEE = ImageTk.PhotoImage(imgyy)
    imgxxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyy = imgxxx.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyy)
    btn1 = tk.Button(login_window, image=imgInvL, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=editIngredientsM)
    btn2 = tk.Button(login_window, image=imgMEE, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=editMaterialsM)
    btn3 = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=backkk_manager)
    
    btn4 = tk.Button(
    login_window,
    text="Add Materials",
    width=16,
    height=2,
    font=("Helvetica", 12, "bold"),
    fg="white",
    bg="#28a745",
    activebackground="#218838",
    bd=0,
    highlightthickness=0,
    cursor="hand2",
    relief="flat",
    command=addMaterials
    )

    btn5 = tk.Button(
    login_window,
    text="Remove Materials",
    width=16,
    height=2,
    font=("Helvetica", 12, "bold"),
    fg="white",
    bg="#dc3545",
    activebackground="#c82333",
    bd=0,
    highlightthickness=0,
    cursor="hand2",
    relief="flat",
    command=removeMaterials
    )

    btn6 = tk.Button(
    login_window,
    text="Add Ingredients",
    width=16,
    height=2,
    font=("Helvetica", 12, "bold"),
    fg="white",
    bg="#28a745",
    activebackground="#218838",
    bd=0,
    highlightthickness=0,
    cursor="hand2",
    relief="flat",
    command=addIngredients
    )

    btn7 = tk.Button(
    login_window,
    text="Remove Ingredients",
    width=16,
    height=2,
    font=("Helvetica", 12, "bold"),
    fg="white",
    bg="#dc3545",
    activebackground="#c82333",
    bd=0,
    highlightthickness=0,
    cursor="hand2",
    relief="flat",
    command=removeIngredients
    )

    btn1.place(x=50, y=160)
    btn2.place(x=50, y=390)
    btn3.place(x=50, y=600)
    btn4.place(x=50, y=490)
    btn5.place(x=240, y=490)
    btn6.place(x=50, y=260)
    btn7.place(x=240, y=260)

    btn1.bind("<Enter>", enlarge_button)
    btn1.bind("<Leave>", shrink_button)
    btn2.bind("<Enter>", enlarge_button)
    btn2.bind("<Leave>", shrink_button)
    
def editIngredientsM():
    stocksNote()
    
    global bg_photo, imgBCK, scrollable_frame

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)

    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")

    scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    def refresh_ingredients():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()

        buttons_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
        buttons_frame.pack(fill="x", padx=10, pady=5)

        ingredients = [item for item in fetch_inventory() if item.get("type") == "ingredient"]

        for idx, item in enumerate(ingredients):
            row = idx // 3
            col = idx % 3

            button_label = f"{item['name']} Quantity"
            update_btn = tk.Button(buttons_frame, text=button_label,
                                   command=lambda itm=item: update_quantity(itm),
                                   bg="#FE31A8", fg="white", font=("Arial", 14, "bold"),
                                   wraplength=170, justify="center")
            update_btn.grid(row=row, column=col, padx=10, pady=5, sticky="nsew")

        for i in range(3):
            buttons_frame.grid_columnconfigure(i, weight=1)

        headers = ["Name", "Quantity", "Unit", "Perishable?", "Note"]
        header_widths = [7, 8, 5, 10, 27]
        cell_widths = [15, 8, 8, 10, 27]
        wrap_lengths = [150, 100, 100, 100, 250]

        header_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
        header_frame.pack(fill="x", pady=5)
        for col, header in enumerate(headers):
            header_label = tk.Label(header_frame, text=header, bg="#fcd7e5", font=("Arial", 20, "bold"), anchor="w", width=header_widths[col])
            header_label.pack(side="left", padx=5)

        for item in ingredients:
            row_frame = tk.Frame(scrollable_frame, bg="#fce4ec")
            row_frame.pack(fill="x", padx=5, pady=2)

            values = [
                item.get("name", ""),
                str(item.get("quantity", "")),
                item.get("unit", ""),
                str(item.get("perishable", "")),
                item.get("note", "")
            ]
            for col, value in enumerate(values):
                cell = tk.Label(row_frame, text=value, bg="#fce4ec", font=("Arial", 16),
                                anchor="w", width=cell_widths[col], justify="left", wraplength=wrap_lengths[col])
                cell.pack(side="left", padx=5)

    def update_quantity(item):
        new_qty = simpledialog.askstring("E", f"Enter new quantity for {item['name']}:")
        if new_qty is not None:
            if new_qty.isdigit():
                new_qty = int(new_qty)
                url = f"https://moodbrew-server.onrender.com/collection/inventory/{item['_id']}"
                payload = {"quantity": new_qty}
                try:
                    response = requests.put(url, json=payload)
                    if response.status_code == 200:
                        messagebox.showinfo("Success", f"{item['name']} quantity updated.")
                        stocksNote()
                        refresh_ingredients()
                    else:
                        print("Failed to update quantity:", response.status_code)
                        messagebox.showerror("Error", "Failed to update quantity.")
                except Exception as e:
                    print("Error updating quantity:", e)
                    messagebox.showerror("Error", f"Error updating quantity: {e}")
            else:
                messagebox.showerror("Invalid Input", "Please enter a whole number (0 or above).")

    refresh_ingredients()

    imgbck = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=edit_inventory_items)
    btnBack.place(x=50, y=600)

def editMaterialsM():
    stocksNote()

    global bg_photo, imgBCK, scrollable_frame

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)

    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")

    scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    def refresh_ingredients():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()

        buttons_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
        buttons_frame.pack(fill="x", padx=10, pady=5)

        ingredients = [item for item in fetch_inventory() if item.get("type") == "material"]

        for idx, item in enumerate(ingredients):
            row = idx // 3
            col = idx % 3

            button_label = f"{item['name']} Quantity"
            update_btn = tk.Button(buttons_frame, text=button_label,
                                   command=lambda itm=item: update_quantity(itm),
                                   bg="#FE31A8", fg="white", font=("Arial", 14),
                                   wraplength=170, justify="center")
            update_btn.grid(row=row, column=col, padx=10, pady=5, sticky="nsew")

        for i in range(3):
            buttons_frame.grid_columnconfigure(i, weight=1)

        headers = ["Name", "Quantity", "Unit", "Note"]
        header_widths = [11, 13, 9, 27]
        cell_widths = [19, 15, 14, 27]
        wrap_lengths = [150, 100, 100, 250]

        header_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
        header_frame.pack(fill="x", pady=5)
        for col, header in enumerate(headers):
            header_label = tk.Label(header_frame, text=header, bg="#fcd7e5", font=("Arial", 20, "bold"), anchor="w", width=header_widths[col])
            header_label.pack(side="left", padx=5)

        for item in ingredients:
            row_frame = tk.Frame(scrollable_frame, bg="#fce4ec")
            row_frame.pack(fill="x", padx=5, pady=2)

            values = [
                item.get("name", ""),
                str(item.get("quantity", "")),
                item.get("unit", ""),
                item.get("note", "")
            ]
            for col, value in enumerate(values):
                cell = tk.Label(row_frame, text=value, bg="#fce4ec", font=("Arial", 16),
                                anchor="w", width=cell_widths[col], justify="left", wraplength=wrap_lengths[col])
                cell.pack(side="left", padx=5)

    def update_quantity(item):
        new_qty = simpledialog.askstring("E", f"Enter new quantity for {item['name']}:")
        if new_qty is not None:
            if new_qty.isdigit():
                new_qty = int(new_qty)
                url = f"https://moodbrew-server.onrender.com/collection/inventory/{item['_id']}"
                payload = {"quantity": new_qty}
                try:
                    response = requests.put(url, json=payload)
                    if response.status_code == 200:
                        messagebox.showinfo("Success", f"{item['name']} quantity updated.")
                        stocksNote()
                        refresh_ingredients()
                    else:
                        print("Failed to update quantity:", response.status_code)
                        messagebox.showerror("Error", "Failed to update quantity.")
                except Exception as e:
                    print("Error updating quantity:", e)
                    messagebox.showerror("Error", f"Error updating quantity: {e}")
            else:
                messagebox.showerror("Invalid Input", "Please enter a whole number (0 or above).")

    refresh_ingredients()

    imgbck = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=edit_inventory_items)
    btnBack.place(x=50, y=600)



# ------------------------





def order_history():

    global imgMEE, imgBCK
    global login_window, bg_photo, imgBCK, scrollable_frame

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)

    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")

    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(
            scrollregion=canvas.bbox("all")
        )
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    users = fetch_orders()
    reversed_users = users[::-1]

    buttons_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
    buttons_frame.pack(fill="x", padx=10, pady=5)

    total_orders = len(users)

    for idx, user in enumerate(reversed_users):
        original_order_number = total_orders - idx
        row = idx // 3
        col = idx % 3

        delete_button = tk.Button(
        buttons_frame,
        text=f"Delete Order {original_order_number}",
        command=lambda u=user: delete_order(u["_id"]),
        bg="red",
        fg="white",
        font=("Arial", 20)
        )
        delete_button.grid(row=row, column=col, padx=10, pady=5, sticky="nsew")

        user_text = f"ORDER {original_order_number}\n"
        user_text += f"NAME: {user['name']}\n\n"

        user_text += "ORDERS:\n"
        for order in user.get("orders", []):
            item_text = f"  {order['name']} ({order['size']}) x{order['quantity']} - {order['totalPrice']} \n\n"
            user_text += item_text

        user_text += f"TOTAL: {user['totalPrice']}\n"
        user_text += f"TIME: {user['timestamp']}\n\n-----------------\n"

        user_label = tk.Label(
        scrollable_frame,
        text=user_text,
        bg="#fcd7e5",
        justify="left",
        anchor="w",
        font=("Arial", 24),
        wraplength=920
        )
        user_label.pack(fill="x", padx=10, pady=5)

    for i in range(3):
        buttons_frame.grid_columnconfigure(i, weight=1)

    imgbck = Image.open("C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=backkk_manager)
    btnBack.place(x=50, y=600)

    def delete_order(order_id):
        confirmation = messagebox.askquestion("Delete Order", f"Do you want to delete this Order?")

        if confirmation == 'yes':
            try:
             
                url = f"https://moodbrew-server.onrender.com/collection/orders/{order_id}"
                print(f"Deleting URL: {url}") 
                response = requests.delete(url)

                if response.status_code == 200:
                    print(f"Order {order_id} deleted successfully")
                    refresh_orders()
                else:
                
                    print(f"Failed to delete Order {order_id}: {response.status_code}, {response.text}")
                    messagebox.showerror("Error", f"Failed to delete Order {order_id}")
            except Exception as e:
                print(f"Error deleting order {order_id}: {e}")
                messagebox.showerror("Error", f"Error deleting order {order_id}: {e}")
        else:
            print("Order deletion cancelled.")

    def refresh_orders():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()

        users = fetch_orders()
        reversed_users = users[::-1]

        buttons_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
        buttons_frame.pack(fill="x", padx=10, pady=5)

        total_orders = len(users)

        for idx, user in enumerate(reversed_users):
            original_order_number = total_orders - idx
            row = idx // 3
            col = idx % 3

            delete_button = tk.Button(
            buttons_frame,
            text=f"Delete Order {original_order_number}",
            command=lambda u=user: delete_order(u["_id"]),
            bg="red",
            fg="white",
            font=("Arial", 20)
            )
            delete_button.grid(row=row, column=col, padx=10, pady=5, sticky="nsew")

            user_text = f"ORDER {original_order_number}\n"
            user_text += f"NAME: {user['name']}\n\n"

            user_text += "ORDERS:\n"
            for order in user.get("orders", []):
                item_text = f"  {order['name']} ({order['size']}) x{order['quantity']} - {order['totalPrice']} \n\n"
                user_text += item_text

            user_text += f"TOTAL: {user['totalPrice']}\n"
            user_text += f"TIME: {user['timestamp']}\n\n-----------------\n"

            user_label = tk.Label(
            scrollable_frame,
            text=user_text,
            bg="#fcd7e5",
            justify="left",
            anchor="w",
            font=("Arial", 24),
            wraplength=920
            )
            user_label.pack(fill="x", padx=10, pady=5)

        for i in range(3):
            buttons_frame.grid_columnconfigure(i, weight=1)


#---------------------------------


def CoffeeOrdersM():

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\homepagebgM.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)


    if "Jua" in font.families():
        jua_font_large = font.Font(family="Arial", size=27, weight="bold")
        jua_font_medium = font.Font(family="Arial", size=20, weight="bold")
    else:
        jua_font_large = font.Font(family="Helvetica", size=27)
        jua_font_medium = font.Font(family="Helvetica", size=20)


    frame = tk.Frame(login_window, bg="#ffd1dc")
    frame.place(x=1, y=63, width=1022, height=230)

    columns = ["Order ID", "Customer Name", "Order Date", "Items Ordered", "Total Price", "Payment Method", "Order Status", "Employee"]

    for col_index, col_name in enumerate(columns):
        cell = tk.Label(frame, text=col_name, font=font.Font(family="Arial", size=20), bg="#ffd1dc", fg="black", relief="ridge", wraplength=120, justify="center")
        cell.grid(row=0, column=col_index, padx=2, pady=12, sticky="nsew")

    for col_index in range(len(columns)):
        frame.grid_columnconfigure(col_index, weight=1)

    row_values = [
        ["#MB001", "JUN-JUN", "2025-03-25", "1x Caramel Frappuccino, 1x Latte", "P450", "CASH", "COMPLETED", "KIRK"],
        ["#MB002", "JOSE", "2025-03-25", "1x Espresso, 1x Mocha", "P380", "CARD", "COMPLETED", "KIRK"],
        ["#MB003", "JOHN", "2025-03-25", "2 Iced Americano", "P480", "CASH", "COMPLETED", "KIRK"]
    ]

    for row_index, values in enumerate(row_values):
        for col_index, value in enumerate(values):
            cell = tk.Label(frame, text=value, font=font.Font(family="Arial", size=12), bg="#ffd1dc", fg="black", relief="ridge", wraplength=120, justify="center")
            cell.grid(row=row_index + 1, column=col_index, padx=2, pady=2, sticky="nsew")


    time_label = tk.Label(login_window, font=font.Font(family="Jua", size=18), bg="#FFffff", fg="black")
    time_label.place(x=570, y=17)
    update_time(time_label)

    tk.Label(login_window, text="Order History (Coffee)", font=font.Font(family="Jua", size=16), bg="#FFD1DC", fg="black").place(x=125, y=20)
    
    tk.Button(login_window, text="Back", font=font.Font(family="Jua", size=14), width=7, height=1, bg="white", fg="black", bd=4, highlightthickness=4, highlightbackground="black", command=order_history).place(x=30, y=590)


def MilkteaOrdersM():

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\homepagebgM.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)


    if "Jua" in font.families():
        jua_font_large = font.Font(family="Jua", size=27)
        jua_font_medium = font.Font(family="Jua", size=20)
    else:
        jua_font_large = font.Font(family="Helvetica", size=27)
        jua_font_medium = font.Font(family="Helvetica", size=20)


    
    time_label = tk.Label(login_window, font=font.Font(family="Jua", size=18), bg="#FFffff", fg="black")
    time_label.place(x=570, y=17)
    update_time(time_label)

    tk.Label(login_window, text="Order History (Milktea)", font=font.Font(family="Jua", size=16), bg="#FFD1DC", fg="black").place(x=125, y=20)
    tk.Label(login_window, text="\"No orders have\nbeen made yet\nat the moment\"", font=font.Font(family="Jua", size=24), bg="#FFD1DC", fg="black").place(x=25, y=130)
    
    tk.Button(login_window, text="Back", font=font.Font(family="Jua", size=14), width=7, height=1, bg="white", fg="black", bd=4, highlightthickness=4, highlightbackground="black", command=order_history).place(x=30, y=590)


# ------------------------


def backkk_manager():

    show_manager_home_page(EMAIL)

def backkk_employee():

    show_employee_home_page(EMAIL)

# ------------------------

def confirm_logout():
    if messagebox.askokcancel("Logout", "Do you want to log out?"):
        logout()




# ------------------------



def logout():

    global login_window, bg_photo, email_entry, password_entry, login_font

    for widget in login_window.winfo_children():
        widget.destroy()

    login_window.title("Mood Brew - Home")
    bg_path = r"C:\Assets\MoodBrewBG\loginbg.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064,709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return
    bg_label = tk.Label(login_window, image=bg_photo, bd=0, highlightthickness=0)
    bg_label.place(x=0, y=0, width=1064, height=709)
    available_fonts = list(font.families())
    if "Jua" in available_fonts:
        login_font = font.Font(family="Jua", size=14)
    else:
        login_font = font.Font(family="Helvetica", size=14)
    tk.Label(login_window, text="Email:", font=login_font, bg="#FFFFFF", fg="black").place(x=30, y=150)
    email_entry = tk.Entry(login_window, font=login_font, bd=0, relief="flat", bg="#FFD1DC", highlightthickness=0)
    email_entry.place(x=30, y=177, width=299, height=27)
    
    def toggle_password():
        if password_entry.cget("show") == "*":
            password_entry.config(show="")
            toggle_button.config(text="Hide")
        else:
            password_entry.config(show="*")
            toggle_button.config(text="Show")

    tk.Label(login_window, text="Password:", font=login_font, bg="#FFFFFF", fg="black").place(x=30, y=220)
    password_entry = tk.Entry(login_window, font=login_font, bd=0, relief="flat", show="*", bg="#FFD1DC", highlightthickness=0)
    password_entry.place(x=30, y=247, width=299, height=27)

    toggle_button = tk.Button(login_window, text="Show", font=login_font, bg="#FFD1DC", fg="black", bd=0, relief="flat", command=toggle_password)
    toggle_button.place(x=30, y=285, width=65, height=24)

    button_canvas = tk.Canvas(login_window, bg="#FFD1DC", bd=0, highlightthickness=0)
    button_canvas.place(x=130, y=300, width=119, height=40)
    create_rounded_rect(button_canvas, 0, 0, 319, 40, radius=10, fill="#FFD1DC", outline="")
    login_button = tk.Button(login_window, text="Login", font=login_font, bg="#FFD1DC", fg="black", bd=0, relief="flat", command=verify_login)
    login_button.place(x=130, y=300, width=119, height=40)

    def on_click():
        forgotPass()

    text_box = tk.Text(login_window, font=login_font, bg="#FFFFFF", fg="black", bd=0, relief="flat", wrap=tk.WORD)
    text_box.place(x=30, y=420, width=320, height=200)

    click_label = tk.Label(login_window, text="Forgot Password?", bg="#FFFFFF", fg="green", cursor="hand2", font=("Arial", 12, "bold underline"))
    click_label.place(x=120, y=580) 
    click_label.bind("<Button-1>", lambda e: on_click())
   

    def update_text_box():
        messages = [
            "\"Coffee is the best thing to douse the sunrise with.\"",
            "\"What on earth could be more luxurious than a sofa, a book, and a cup of coffee?\"",
            "\"I like my coffee strong and my mornings bright.\"",
            "\"It’s amazing how the world begins to change through the eyes of a cup of coffee.\"",
            "\"Coffee first. Schemes later.\"",
            "\"A morning without coffee is like sleep.\"",
            "\"Coffee, the favorite drink of the civilized world.\"",
            "\"Never trust anyone who doesn’t drink coffee.\"",
            "\"May your coffee be strong and your Monday be short.\"",
            "\"I orchestrate my mornings to the tune of coffee.\""
        ]

        message = random.choice(messages)
        text_box.config(state=tk.NORMAL) 
        text_box.delete("1.0", tk.END)
        text_box.insert(tk.END, message)
        text_box.config(state=tk.DISABLED)
        login_window.after(3000, update_text_box)
        
    update_text_box()



# ------------------------



def show_employee_home_page(email):
    global imgCCLG, imgCO, imgIO, imgOHE, imgLOGE

    for widget in login_window.winfo_children():
        widget.destroy()

    login_window.title("Mood Brew - Employee Portal")

    bg_path = r"C:\Assets\MoodBrewBG\homepagebgE.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    if "Jua" in font.families():
        jua_font_large = font.Font(family="Jua", size=27)
        jua_font_medium = font.Font(family="Jua", size=20)
    else:
        jua_font_large = font.Font(family="Helvetica", size=27)
        jua_font_medium = font.Font(family="Helvetica", size=20)

    time_label = tk.Label(login_window, font=font.Font(family="Lato", size=16), bg="#FEF8FA", fg="black")
    time_label.place(x=555, y=15)
    update_time(time_label)

    imgxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\EMPLOYEE_create_an_order_btn.png")
    imgyy = imgxx.resize((360, 100))
    imgCO = ImageTk.PhotoImage(imgyy)
    imgxxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\EMPLOYEE_inventory_overview_btn.png")
    imgyyy = imgxxx.resize((360, 100))
    imgIO = ImageTk.PhotoImage(imgyyy)
    imgxxxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\EMPLOYEE_order_history_btn.png")
    imgyyyy = imgxxxx.resize((360, 100))
    imgOHE = ImageTk.PhotoImage(imgyyyy)
    imglogoutx = Image.open("C:\Assets\Moodbrew Logo and Emojis\LOGOUT.png")
    imglogouty = imglogoutx.resize((360, 100))
    imgLOGE = ImageTk.PhotoImage(imglogouty)

    btn2 = tk.Button(login_window, image=imgCO, width=360, height=100, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=loadingCD)
    btn3 = tk.Button(login_window, image=imgIO, width=360, height=100, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=loadingVI)
    btn4 = tk.Button(login_window, image=imgOHE, width=360, height=100, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=loadingOH)
    btn5 = tk.Button(login_window, image=imgLOGE, width=360, height=100, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=confirm_logout)

    btn2.place(x=50, y=110)
    btn3.place(x=50, y=250)
    btn4.place(x=50, y=390)
    btn5.place(x=50, y=530)



# ------------------------



def createDrink():
    global imgMEE, imgBCK
    global login_window, bg_photo, imgBCK, scrollable_frame
    global disabled_orders
    disabled_orders = set()

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)

    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")

    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(
            scrollregion=canvas.bbox("all")
        )
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    users = fetch_orders()

    buttons_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
    buttons_frame.pack(fill="x", padx=10, pady=5)

    for idx, user in enumerate(users):
        row = idx // 3
        col = idx % 3

        btn = tk.Button(buttons_frame, text=f"Accept Order {idx+1}", bg="#34abcd", fg="white", font=("Arial", 20))
        btn.grid(row=row, column=col, padx=10, pady=5, sticky="nsew")

        if user.get("accepted", False):
            btn.config(state="disabled", text=f"Order {idx+1} Accepted", bg="gray", fg="white", disabledforeground="white")
        else:
            btn.config(command=lambda u=user, b=btn: delete_order(u["_id"], u, b))

        user_text = f"ORDER {idx + 1}\n"
        user_text += f"NAME: {user['name']}\n\nORDERS:\n"
        for order in user.get("orders", []):
            item_text = f"  {order['name']} ({order['size']}) x{order['quantity']} - {order['totalPrice']} \n\n"
            user_text += item_text

        user_text += f"TOTAL: {user['totalPrice']}\n"
        user_text += f"TIME: {user['timestamp']}\n\n-----------------\n"

        user_label = tk.Label(scrollable_frame, text=user_text, bg="#fcd7e5", justify="left", anchor="w", font=("Arial", 24), wraplength=920)
        user_label.pack(fill="x", padx=10, pady=5)

    for i in range(3):
        buttons_frame.grid_columnconfigure(i, weight=1)

    imgbck = Image.open("C:\\Assets\\Moodbrew Logo and Emojis\\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=backkk_employee)
    btnBack.place(x=50, y=600)

    def delete_order(order_id, user_data, button_widget):
        confirmation = messagebox.askquestion("Accept Order", "Accept this Order?")

        if confirmation == 'yes':
            try:
                import time

                popup = tk.Toplevel(login_window)
                popup.title("Processing Order")
                popup.geometry("400x300")
                popup.configure(bg="#ffd1dc")
                popup.resizable(False, False)
                popup.iconbitmap(r"C:\Assets\MoodBrewBG\icon.ico")

                loading_label = tk.Label(popup, text="Loading", font=("Arial", 18, "bold"), bg="#ffd1dc")
                loading_label.pack(pady=10)

                log_text = tk.Text(popup, height=12, width=45, font=("Arial", 12), state="disabled", bg="#f0f0f0")
                log_text.pack(pady=5)

                popup.update()

                def animate_loading():
                    dots = ["", ".", "..", "..."]
                    idx = 0
                    for _ in range(10):  
                        loading_label.config(text=f"Loading{dots[idx % 4]}", bg="#ffd1dc")
                        popup.update()
                        time.sleep(0.3)
                        idx += 1

                animate_loading()

                coffee_to_inventory = {
                    "americano": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Coffee Beans (Espresso)": 8,
                        "Sugar": 5
                    },
                    "butterscotch": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Butterscotch Syrup": 20,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150
                    },
                    "spanish latte": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Condensed Milk": 30,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150
                    },
                    "cappuccino": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150,
                        "Milk Foam": 30,
                        "Sugar": 5
                    },
                    "iced cappuccino": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150,
                        "Milk Foam": 30,
                        "Sugar": 5
                    },
                    "flat white": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150,
                        "Sugar": 5
                    },
                    "cafe latte": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150,
                        "Sugar": 5
                    },
                    "hazelnut latte": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150,
                        "Sugar": 5,
                        "Hazelnut Syrup": 20
                    },
                    "caramel macchiato": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150,
                        "Sugar": 5,
                        "Caramel Syrup": 20
                    },
                    "salted caramel": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150,
                        "Sugar": 5,
                        "Salted Caramel Syrup": 20
                    },
                    "french vanilla": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150,
                        "Sugar": 5,
                        "Vanilla Syrup": 20
                    },
                    "mocha": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150,
                        "Sugar": 5,
                        "Chocolate Syrup": 20
                    },
                    "white mocha": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Coffee Beans (Espresso)": 8,
                        "Steamed Milk": 150,
                        "Sugar": 5,
                        "White Chocolate Syrup": 20
                    },
                    "dirty matcha": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Matcha Powder": 5,
                        "Liquid sweetener": 10,
                        "Steamed Milk": 150
                    },
                    "matcha": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Matcha Powder": 5,
                        "Liquid sweetener": 10,
                        "Steamed Milk": 150
                    },
                    "strawberry matcha": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Matcha Powder": 5,
                        "Liquid sweetener": 10,
                        "Steamed Milk": 150,
                        "Strawberry Syrup": 20
                    },
                    "strawberry milk": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Liquid sweetener": 10,
                        "Steamed Milk": 150,
                        "Strawberry Syrup": 20
                    },
                    "chocolate": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Liquid sweetener": 10,
                        "Steamed Milk": 150,
                        "Chocolate Syrup": 20
                    },
                    "choco chip frappe": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Milk Foam": 180,
                        "Chocolate Syrup": 20,
                        "Chocolate Chips": 10,
                        "Whipped Cream": 20
                    },
                    "caramatcha frappe": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Milk Foam": 180,
                        "Caramel Syrup": 20,
                        "Matcha Powder": 5,
                        "Whipped Cream": 20
                    },
                    "salted caramel frappuccino": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Coffee Beans (Espresso)": 8,
                        "Milk Foam": 180,
                        "Caramel Syrup": 20,
                        "Whipped Cream": 20
                    },
                    "ube tarro frappe": {
                        "Cups": 1,
                        "Lids": 1,
                        "Straws": 1,
                        "Napkins": 2,
                        "Tube Ice": 180,
                        "Milk Foam": 180,
                        "Ube & Taro Syrup": 20,
                        "Whipped Cream": 20
                    }
                }

                raw_orders = user_data.get("orders", [])
                if isinstance(raw_orders, str):
                    try:
                        raw_orders = ast.literal_eval(raw_orders)
                    except Exception as e:
                        print("Failed to parse orders:", e)
                        raw_orders = []

                parsed_orders = []
                for order in raw_orders:
                    if isinstance(order, str):
                        try:
                            order = ast.literal_eval(order)
                        except Exception as e:
                            print(f"Failed to parse individual order: {e}")
                            continue
                    if isinstance(order, dict):
                        parsed_orders.append(order)

                inventory_response = requests.get("https://moodbrew-server.onrender.com/collection/inventory")
                inventory = inventory_response.json() if inventory_response.ok else []

                updated_inventory = {}
                for order in parsed_orders:
                    name_lower = order['name'].lower()
                    quantity = order['quantity']

                    for coffee_key, deductions in coffee_to_inventory.items():
                        if coffee_key in name_lower:
                            for item_name, per_unit_qty in deductions.items():
                                total_deduct = per_unit_qty * quantity
                                if item_name in updated_inventory:
                                    updated_inventory[item_name] += total_deduct
                                else:
                                    updated_inventory[item_name] = total_deduct

                for item in inventory:
                    item_name = item["name"]
                    if item_name in updated_inventory:
                        new_quantity = max(0, item["quantity"] - updated_inventory[item_name])
                        update_url = f"https://moodbrew-server.onrender.com/collection/inventory/{item['_id']}"
                        requests.put(update_url, json={"quantity": new_quantity})
                        
                        log_text.config(state="normal")
                        log_text.insert("end", f"Updated {item_name}: {item['quantity']}   →   {new_quantity}\n")
                        log_text.see("end")
                        log_text.config(state="disabled")
                        popup.update()
                        time.sleep(0.1)

                totalsales_payload = {
                    "employee": CURRENT_USER["name"],
                    "orders": [f"{o['name']} ({o['size']}) x{o['quantity']}" for o in parsed_orders],
                    "totalPrice": user_data["totalPrice"],
                    "time": user_data["timestamp"]
                }

                insert_url = "https://moodbrew-server.onrender.com/collection/totalsales"
                insert_response = requests.post(insert_url, json=totalsales_payload)

                if insert_response.ok:
                    print(f"Inserted order {order_id} to totalsales")

                    update_url = f"https://moodbrew-server.onrender.com/collection/orders/{order_id}"
                    update_response = requests.put(update_url, json={"accepted": True})

                    if update_response.ok:
                        print(f"Order {order_id} marked as accepted")
                        button_widget.config(state="disabled", text="Accepted")
                        loading_label.config(text="Order Accepted ✔", fg="green")
                        popup.update()
                        time.sleep(1.5)
                        popup.destroy()
                        refresh_orders()
                    else:
                        print("Failed to update order status:", update_response.status_code)
                        messagebox.showerror("Error", "Failed to mark order as accepted.")
                else:
                    print("Failed to insert to totalsales:", insert_response.status_code)
                    messagebox.showerror("Error", "Failed to insert to totalsales.")
            except Exception as e:
                print("Error accepting order:", e)
                messagebox.showerror("Error", f"Error accepting order: {e}")
        else:
            print("Order acceptance cancelled.")

    def refresh_orders():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()

        users = fetch_orders()

        buttons_frame = tk.Frame(scrollable_frame, bg="#fcd7e5")
        buttons_frame.pack(fill="x", padx=10, pady=5)

        for idx, user in enumerate(users):
            row = idx // 3
            col = idx % 3

            btn = tk.Button(buttons_frame, text=f"Accept Order {idx+1}", bg="#34abcd", fg="white", font=("Arial", 20))
            btn.grid(row=row, column=col, padx=10, pady=5, sticky="nsew")

            if user.get("accepted", False):
                btn.config(state="disabled", text=f"Order {idx+1} Accepted", bg="gray", fg="white", disabledforeground="white")
            else:
                btn.config(command=lambda u=user, b=btn: delete_order(u["_id"], u, b))

            user_text = f"ORDER {idx + 1}\n"
            user_text += f"NAME: {user['name']}\n\nORDERS:\n"
            for order in user.get("orders", []):
                item_text = f"  {order['name']} ({order['size']}) x{order['quantity']} - {order['totalPrice']} \n\n"
                user_text += item_text

            user_text += f"TOTAL: {user['totalPrice']}\n"
            user_text += f"TIME: {user['timestamp']}\n\n-----------------\n"

            user_label = tk.Label(scrollable_frame, text=user_text, bg="#fcd7e5", justify="left", anchor="w", font=("Arial", 24), wraplength=920)
            user_label.pack(fill="x", padx=10, pady=5)

        for i in range(3):
            buttons_frame.grid_columnconfigure(i, weight=1)


# ------------------------


def inventory_listEMP():
    stocksNote()

    global imgInvL, imgMEE, imgBCK

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\homepagebgE.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    if "Jua" in font.families():
        jua_font_large = font.Font(family="Jua", size=27)
        jua_font_medium = font.Font(family="Jua", size=20)
    else:
        jua_font_large = font.Font(family="Helvetica", size=27)
        jua_font_medium = font.Font(family="Helvetica", size=20)

    time_label = tk.Label(login_window, font=font.Font(family="Lato", size=16), bg="#FEF8FA", fg="black")
    time_label.place(x=555, y=15)
    update_time(time_label)

    imgx = Image.open("C:\Assets\Moodbrew Logo and Emojis\ingredients_btn.png")
    imgy = imgx.resize((360, 90))
    imgInvL = ImageTk.PhotoImage(imgy)
    imgxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\materials_btn.png")
    imgyy = imgxx.resize((360, 90))
    imgMEE = ImageTk.PhotoImage(imgyy)
    imgxxx = Image.open("C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyy = imgxxx.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyy)
    btn1 = tk.Button(login_window, image=imgInvL, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=ingredsEMP)
    btn2 = tk.Button(login_window, image=imgMEE, width=360, height=90, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=materialsEMP)
    btn3 = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=backkk_employee)
    
    btn1.place(x=50, y=230)
    btn2.place(x=50, y=390)
    btn3.place(x=50, y=600)

    btn1.bind("<Enter>", enlarge_button)
    btn1.bind("<Leave>", shrink_button)
    btn2.bind("<Enter>", enlarge_button)
    btn2.bind("<Leave>", shrink_button)

def ingredsEMP():

    global bg_photo, imgBCK, scrollable_frame
    
    for widget in login_window.winfo_children():
        widget.destroy()
    
    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return
    
    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)
    
    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)
    
    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")
    
    scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
    
    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    scrollable_frame.update_idletasks()
    canvas.config(scrollregion=canvas.bbox("all"))
  
    def refresh_ingredients():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()
        headers = ["Name", "Quantity", "Unit", "Perishable?", "Note"]
        header_widths = [7, 8, 5, 10, 27]
        cell_widths = [15, 8, 8, 10, 27]
        wrap_lengths = [150, 100, 100, 100, 250]
        for col, header in enumerate(headers):
            header_label = tk.Label(scrollable_frame, text=header, bg="#fcd7e5", font=("Arial", 20, "bold"), anchor="w", width=header_widths[col])
            header_label.grid(row=0, column=col, padx=5, pady=10, sticky="w")
        ingredients = [item for item in fetch_inventory() if item.get("type") == "ingredient"]
        for idx, item in enumerate(ingredients, start=1):
            values = [
                item.get("name", ""),
                str(item.get("quantity", "")),
                item.get("unit", ""),
                str(item.get("perishable", "")),
                item.get("note", "")
            ]
            for col, value in enumerate(values):
                cell = tk.Label(scrollable_frame, text=value, bg="#fce4ec", font=("Arial", 16), anchor="w", width=cell_widths[col], justify="left", wraplength=wrap_lengths[col])
                cell.grid(row=idx, column=col, padx=5, pady=5, sticky="w")
        for col in range(len(headers)):
            scrollable_frame.grid_columnconfigure(col, weight=1)
    
    refresh_ingredients()
    
    imgbck = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=inventory_listEMP)
    btnBack.place(x=50, y=600)



def materialsEMP():

    global bg_photo, imgBCK, scrollable_frame
    
    for widget in login_window.winfo_children():
        widget.destroy()
    
    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return
    
    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)
    
    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)
    
    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")
    
    scrollable_frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
    
    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    scrollable_frame.update_idletasks()
    canvas.config(scrollregion=canvas.bbox("all"))
  
    def refresh_ingredients():
        for widget in scrollable_frame.winfo_children():
            widget.destroy()
        headers = ["Name", "Quantity", "Unit", "Note"]
        header_widths = [7, 8, 5, 27]
        cell_widths = [15, 8, 8, 27]
        wrap_lengths = [150, 100, 100, 250]
        for col, header in enumerate(headers):
            header_label = tk.Label(scrollable_frame, text=header, bg="#fcd7e5", font=("Arial", 20, "bold"), anchor="w", width=header_widths[col])
            header_label.grid(row=0, column=col, padx=5, pady=10, sticky="w")
        ingredients = [item for item in fetch_inventory() if item.get("type") == "material"]
        for idx, item in enumerate(ingredients, start=1):
            values = [
                item.get("name", ""),
                str(item.get("quantity", "")),
                item.get("unit", ""),
                item.get("note", "")
            ]
            for col, value in enumerate(values):
                cell = tk.Label(scrollable_frame, text=value, bg="#fce4ec", font=("Arial", 16), anchor="w", width=cell_widths[col], justify="left", wraplength=wrap_lengths[col])
                cell.grid(row=idx, column=col, padx=5, pady=5, sticky="w")
        for col in range(len(headers)):
            scrollable_frame.grid_columnconfigure(col, weight=1)
    
    refresh_ingredients()
    
    imgbck = Image.open(r"C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=inventory_listEMP)
    btnBack.place(x=50, y=600)



# ------------------------



def order_historyEMP():

    global imgMEE, imgBCK
    global login_window, bg_photo, imgBCK, scrollable_frame

    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\MANAGER_CLEAN_BG.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064, 709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo)
    bg_label.image = bg_photo
    bg_label.place(x=0, y=0, width=1064, height=709)

    container_frame = tk.Frame(login_window, bg="#fcd7e5")
    container_frame.place(x=50, y=77, width=964, height=500)

    canvas = tk.Canvas(container_frame, bg="#fcd7e5", bd=0, highlightthickness=0)
    scrollbar = tk.Scrollbar(container_frame, orient="vertical", command=canvas.yview)
    scrollable_frame = tk.Frame(canvas, bg="#fcd7e5")

    scrollable_frame.bind(
        "<Configure>",
        lambda e: canvas.configure(
            scrollregion=canvas.bbox("all")
        )
    )

    canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
    canvas.configure(yscrollcommand=scrollbar.set)

    canvas.pack(side="left", fill="both", expand=True)
    scrollbar.pack(side="right", fill="y")

    users = fetch_orders()
    reversed_users = users[::-1]

    total_orders = len(users)

    for idx, user in enumerate(reversed_users):
        original_order_number = total_orders - idx

        user_text = f"ORDER {original_order_number}\n"
        user_text += f"NAME: {user['name']}\n\n"

        user_text += "ORDERS:\n"
        for order in user.get("orders", []):
            item_text = f"  {order['name']} ({order['size']}) x{order['quantity']} - {order['totalPrice']} \n\n"
            user_text += item_text

        user_text += f"TOTAL: {user['totalPrice']}\n"
        user_text += f"TIME: {user['timestamp']}\n\n-----------------\n"

        user_label = tk.Label(
        scrollable_frame,
        text=user_text,
        bg="#fcd7e5",
        justify="left",
        anchor="w",
        font=("Arial", 24),
        wraplength=920
        )
        user_label.pack(fill="x", padx=10, pady=5)

    imgbck = Image.open("C:\Assets\Moodbrew Logo and Emojis\kback_btn.png")
    imgyyybck = imgbck.resize((160, 45))
    imgBCK = ImageTk.PhotoImage(imgyyybck)
    btnBack = tk.Button(login_window, image=imgBCK, width=160, height=45, fg="black", bd=0, highlightthickness=0, highlightbackground="black", command=backkk_employee)
    btnBack.place(x=50, y=600)



# ------------------------



def newPass():
    global login_window, bg_photo, login_font
    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\loginbg.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064,709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return

    bg_label = tk.Label(login_window, image=bg_photo, bd=0, highlightthickness=0)
    bg_label.place(x=0, y=0, width=1064, height=709)

    login_font = font.Font(family="Jua", size=17) if "Jua" in font.families() else font.Font(family="Helvetica", size=18)
    label_font = font.Font(family="Jua", size=14) if "Jua" in font.families() else font.Font(family="Helvetica", size=18)

    tk.Label(login_window, text="Enter your new password below", font=login_font, bg="#FFFFFF", fg="black").place(x=30, y=150)

    tk.Label(login_window, text="Enter New Password", font=label_font, bg="#FFFFFF", fg="black").place(x=34, y=220)
    new_pass_frame = tk.Frame(login_window, bg="#FDA2D0")
    new_pass_frame.place(x=36, y=250, width=307, height=35)
    new_pass_entry = tk.Entry(login_window, font=login_font, bd=0, relief="flat", bg="#FFD1DC", show="*")
    new_pass_entry.place(x=40, y=254, width=299, height=27)

    tk.Label(login_window, text="Re-Enter Password", font=label_font, bg="#FFFFFF", fg="black").place(x=34, y=290)
    confirm_pass_frame = tk.Frame(login_window, bg="#FDA2D0")
    confirm_pass_frame.place(x=36, y=320, width=307, height=35)
    confirm_pass_entry = tk.Entry(login_window, font=login_font, bd=0, relief="flat", bg="#FFD1DC", show="*")
    confirm_pass_entry.place(x=40, y=324, width=299, height=27)

    def toggle_password():
        current_show = new_pass_entry.cget("show")
        new_show = "" if current_show == "*" else "*"
        new_pass_entry.config(show=new_show)
        confirm_pass_entry.config(show=new_show)

    toggle_btn = tk.Button(login_window, text="👁", font=("Arial", 15), command=toggle_password, bd=0, bg="#FFD1DC")
    toggle_btn.place(x=37, y=363)

    def update_password():
        new_pass = new_pass_entry.get()
        confirm_pass = confirm_pass_entry.get()

        if not new_pass or not confirm_pass:
            messagebox.showerror("Error", "Please fill out all fields.")
            return
        if new_pass != confirm_pass:
            messagebox.showerror("Error", "Passwords do not match.")
            return

        try:
            update_url = f"https://moodbrew-server.onrender.com/collection/users/{CURRENT_USER['_id']}"
            update_data = {"password": new_pass}
            requests.put(update_url, json=update_data)
            messagebox.showinfo("Success", "Password updated successfully!")
            logout()
        except Exception as e:
            messagebox.showerror("Error", f"Failed to update password: {str(e)}")

    submit_btn = tk.Button(login_window, text="Update Password", font=login_font, bg="#FFD1DC", command=update_password)
    submit_btn.place(x=90, y=430, width=205, height=55)


def forgotPassFunction():
    global CURRENT_USER
    fetch_users()

    email = email_entry.get().strip()
    if not email:
        messagebox.showerror("Error", "Please enter your email.")
        return

    selected_user = next((user for user in ALL_USERS if user["email"] == email), None)

    if not selected_user:
        messagebox.showerror("Error", "Email not found.")
        return

    CURRENT_USER = selected_user 

    send_verification_code(email)
    prompt_verification_code(callback=newPass) 

def forgotPass():

    global login_window, bg_photo, email_entry, login_font
    for widget in login_window.winfo_children():
        widget.destroy()

    bg_path = r"C:\Assets\MoodBrewBG\loginbg.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064,709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return
    bg_label = tk.Label(login_window, image=bg_photo, bd=0, highlightthickness=0)
    bg_label.place(x=0, y=0, width=1064, height=709)
    available_fonts = list(font.families())
    if "Jua" in available_fonts:
        login_font = font.Font(family="Jua", size=18)
    else:
        login_font = font.Font(family="Helvetica", size=18)
    tk.Label(login_window, text="Please enter your email below,\nthen we will send a \nverification code to it\nand you'll be directed to \nchange your password", font=login_font, bg="#FFFFFF", fg="black").place(x=33, y=150)
    
    email_frame = tk.Frame(login_window, bg="#FDA2D0", highlightthickness=0)
    email_frame.place(x=36, y=321, width=307, height=35)
    email_entry = tk.Entry(login_window, font=login_font, bd=0, relief="flat", bg="#FFD1DC", highlightthickness=0)
    email_entry.place(x=40, y=325, width=299, height=27)

    button_frame = tk.Frame(login_window, bg="#FDA2D0", highlightthickness=0)
    button_frame.place(x=86, y=446, width=198, height=63)
    login_button = tk.Button(login_window, text="Send Verification\nCode", font=login_font, bg="#FFD1DC", fg="black", bd=0, relief="flat", command=forgotPassFunction)
    login_button.place(x=90, y=450, width=190, height=55)

    click_label = tk.Label(login_window, text="Return to Home", bg="#FFFFFF", fg="green", cursor="hand2", font=("Arial", 12, "bold underline"))
    click_label.place(x=120, y=580) 
    click_label.bind("<Button-1>", lambda e: logout())



# ------------------------



def stocksNote():
    try:
        inventory_url = "https://moodbrew-server.onrender.com/collection/inventory"
        response = requests.get(inventory_url)

        if not response.ok:
            print("Failed to fetch inventory data.")
            return

        inventory = response.json()

        for item in inventory:
            item_id = item["_id"]
            quantity = item["quantity"]
            item_type = item.get("type", "").lower()
            note = ""

            if item_type == "material":
                if quantity == 0:
                    note = "Out of Stock"
                elif 1 <= quantity <= 20:
                    note = "Low Stock"
                elif 21 <= quantity <= 80:
                    note = "Enough Stock"
                else:
                    note = "Full Stock"

            elif item_type == "ingredient":
                if quantity <= 100:
                    note = "Out of Stock"
                elif 101 <= quantity <= 2000:
                    note = "Low Stock"
                elif 2001 <= quantity <= 4500:
                    note = "Enough Stock"
                else:
                    note = "Full Stock"

            if note and note != item.get("note", ""):
                update_url = f"{inventory_url}/{item_id}"
                requests.put(update_url, json={"note": note})
                print(f"Updated {item['name']} → {note}")

    except Exception as e:
        print("Error in stocksNote:", e)

stocksNote()



# ------------------------



def main():
    
    global login_window, bg_photo, email_entry, password_entry, login_font
    login_window = tk.Tk()
    login_window.title("Mood Brew")
    login_window.geometry("1064x709")
    login_window.resizable(False, False)
    login_window.iconbitmap(r"C:\Assets\MoodBrewBG\icon.ico")
    bg_path = r"C:\Assets\MoodBrewBG\loginbg.png"
    try:
        bg_image = Image.open(bg_path)
        bg_image = bg_image.resize((1064,709), Image.LANCZOS)
        bg_photo = ImageTk.PhotoImage(bg_image)
    except Exception as e:
        print("Error loading background image:", e)
        return
    bg_label = tk.Label(login_window, image=bg_photo, bd=0, highlightthickness=0)
    bg_label.place(x=0, y=0, width=1064, height=709)
    available_fonts = list(font.families())
    if "Jua" in available_fonts:
        login_font = font.Font(family="Jua", size=14)
    else:
        login_font = font.Font(family="Helvetica", size=14)
    tk.Label(login_window, text="Email:", font=login_font, bg="#FFFFFF", fg="black").place(x=30, y=150)
    email_entry = tk.Entry(login_window, font=login_font, bd=0, relief="flat", bg="#FFD1DC", highlightthickness=0)
    email_entry.place(x=30, y=177, width=299, height=27)
    
    def toggle_password():
        if password_entry.cget("show") == "*":
            password_entry.config(show="")
            toggle_button.config(text="Hide")
        else:
            password_entry.config(show="*")
            toggle_button.config(text="Show")

    tk.Label(login_window, text="Password:", font=login_font, bg="#FFFFFF", fg="black").place(x=30, y=220)
    password_entry = tk.Entry(login_window, font=login_font, bd=0, relief="flat", show="*", bg="#FFD1DC", highlightthickness=0)
    password_entry.place(x=30, y=247, width=299, height=27)

    toggle_button = tk.Button(login_window, text="Show", font=login_font, bg="#FFD1DC", fg="black", bd=0, relief="flat", command=toggle_password)
    toggle_button.place(x=30, y=285, width=65, height=24)

    button_canvas = tk.Canvas(login_window, bg="#FFD1DC", bd=0, highlightthickness=0)
    button_canvas.place(x=130, y=300, width=119, height=40)
    create_rounded_rect(button_canvas, 0, 0, 319, 40, radius=10, fill="#FFD1DC", outline="")
    login_button = tk.Button(login_window, text="Login", font=login_font, bg="#FFD1DC", fg="black", bd=0, relief="flat", command=verify_login)
    login_button.place(x=130, y=300, width=119, height=40)

    def on_click():
        forgotPass()

    text_box = tk.Text(login_window, font=login_font, bg="#FFFFFF", fg="black", bd=0, relief="flat", wrap=tk.WORD)
    text_box.place(x=30, y=420, width=320, height=200)

    click_label = tk.Label(login_window, text="Forgot Password?", bg="#FFFFFF", fg="green", cursor="hand2", font=("Arial", 12, "bold underline"))
    click_label.place(x=120, y=580) 
    click_label.bind("<Button-1>", lambda e: on_click())
   

    def update_text_box():
        messages = [
            "\"Coffee is the best thing to douse the sunrise with.\"",
            "\"What on earth could be more luxurious than a sofa, a book, and a cup of coffee?\"",
            "\"I like my coffee strong and my mornings bright.\"",
            "\"It’s amazing how the world begins to change through the eyes of a cup of coffee.\"",
            "\"Coffee first. Schemes later.\"",
            "\"A morning without coffee is like sleep.\"",
            "\"Coffee, the favorite drink of the civilized world.\"",
            "\"Never trust anyone who doesn’t drink coffee.\"",
            "\"May your coffee be strong and your Monday be short.\"",
            "\"I orchestrate my mornings to the tune of coffee.\""
        ]

        message = random.choice(messages)
        text_box.config(state=tk.NORMAL) 
        text_box.delete("1.0", tk.END)
        text_box.insert(tk.END, message)
        text_box.config(state=tk.DISABLED)
        login_window.after(3000, update_text_box)
        
    update_text_box()
    login_window.mainloop()

if __name__ == "__main__":
    main()