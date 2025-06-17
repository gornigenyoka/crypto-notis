import sys
import os
import pandas as pd
import webbrowser
import requests
from PyQt5.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton, QMessageBox, QFileDialog, QInputDialog, QLineEdit, QTextEdit, QComboBox
)
from PyQt5.QtGui import QPixmap, QGuiApplication
from PyQt5.QtCore import Qt
from PIL import Image
import io
import openai
import shutil
import re

WORKSPACE_DIR = r"C:\Users\alexa\Downloads\crypto-glass-beacon-66-main"
CSV_FILE = os.path.join(WORKSPACE_DIR, "public", "ref_links.csv")
LOGO_DIR = os.path.join(WORKSPACE_DIR, "public", "logos")
FAVICON_DIR = os.path.join(WORKSPACE_DIR, "public", "favicons")
os.makedirs(os.path.dirname(CSV_FILE), exist_ok=True)
os.makedirs(LOGO_DIR, exist_ok=True)
os.makedirs(FAVICON_DIR, exist_ok=True)

def safe_platform_name(name):
    return "".join(c if c.isalnum() else "_" for c in name)

class RefLinksApp(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Ref Links Validator")
        self.resize(1000, 650)
        try:
            self.df = pd.read_csv(CSV_FILE)
            # Ensure favicon column exists and is string type
            if 'favicon' not in self.df.columns:
                self.df['favicon'] = ''
            else:
                self.df['favicon'] = self.df['favicon'].astype(str)
        except FileNotFoundError:
            QMessageBox.critical(self, "Error", f"Could not find input CSV file at: {CSV_FILE}")
            sys.exit(1)
        self.current_index = 0
        self.logo_paths = ["" for _ in range(len(self.df))]
        self.api_key = ""
        self.verified = [{"website": False, "referral": False, "logo": False, "desc": False, "features": False, "capsules": False, "favicon": False} for _ in range(len(self.df))]
        self.website_verified = [False for _ in range(len(self.df))]
        self.init_ui()
        self.show_entry()

    def init_ui(self):
        layout = QVBoxLayout()
        self.entry_label = QLabel()
        self.entry_label.setWordWrap(True)
        layout.addWidget(self.entry_label)
        # Logo display
        self.logo_label = QLabel("No logo")
        self.logo_label.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.logo_label)
        # Logo status label (for silent feedback)
        self.logo_status = QLabel("")
        self.logo_status.setAlignment(Qt.AlignCenter)
        layout.addWidget(self.logo_status)
        # Logo actions
        logo_btn_layout = QHBoxLayout()
        self.search_logo_btn = QPushButton("Search Logo Online")
        self.search_logo_btn.clicked.connect(self.search_logo_online)
        logo_btn_layout.addWidget(self.search_logo_btn)
        self.paste_logo_btn = QPushButton("Paste Logo from Clipboard")
        self.paste_logo_btn.clicked.connect(self.paste_logo_clipboard)
        logo_btn_layout.addWidget(self.paste_logo_btn)
        self.download_logo_btn = QPushButton("Download Logo from URL")
        self.download_logo_btn.clicked.connect(self.download_logo_from_url)
        logo_btn_layout.addWidget(self.download_logo_btn)
        self.upload_logo_btn = QPushButton("Upload Logo")
        self.upload_logo_btn.clicked.connect(self.upload_logo)
        logo_btn_layout.addWidget(self.upload_logo_btn)
        layout.addLayout(logo_btn_layout)
        # Editable Official Website and Referral Link with open and verify buttons
        web_layout = QHBoxLayout()
        self.website_edit = QLineEdit()
        self.website_edit.setPlaceholderText("Official Website")
        web_layout.addWidget(QLabel("Official Website:"))
        web_layout.addWidget(self.website_edit)
        self.website_open_btn = QPushButton("Visit")
        self.website_open_btn.clicked.connect(self.open_website)
        web_layout.addWidget(self.website_open_btn)
        self.website_verify_btn = QPushButton("Verify")
        self.website_verify_btn.clicked.connect(self.website_verify_action)
        web_layout.addWidget(self.website_verify_btn)
        self.website_check = QLabel("")
        web_layout.addWidget(self.website_check)
        self.referral_edit = QLineEdit()
        self.referral_edit.setPlaceholderText("Referral Link")
        web_layout.addWidget(QLabel("Referral Link:"))
        web_layout.addWidget(self.referral_edit)
        self.referral_open_btn = QPushButton("Visit")
        self.referral_open_btn.clicked.connect(self.open_referral)
        web_layout.addWidget(self.referral_open_btn)
        layout.addLayout(web_layout)
        # Favicon display and actions
        favicon_layout = QHBoxLayout()
        self.favicon_label = QLabel()
        self.favicon_label.setAlignment(Qt.AlignCenter)
        favicon_layout.addWidget(self.favicon_label)
        self.get_favicon_btn = QPushButton("Get Favicon")
        self.get_favicon_btn.clicked.connect(self.get_favicon_from_website)
        favicon_layout.addWidget(self.get_favicon_btn)
        self.paste_favicon_btn = QPushButton("Paste Favicon from Clipboard")
        self.paste_favicon_btn.clicked.connect(self.paste_favicon_clipboard)
        favicon_layout.addWidget(self.paste_favicon_btn)
        self.upload_favicon_btn = QPushButton("Upload Favicon")
        self.upload_favicon_btn.clicked.connect(self.upload_favicon)
        favicon_layout.addWidget(self.upload_favicon_btn)
        layout.addLayout(favicon_layout)
        # Description
        desc_layout = QHBoxLayout()
        self.desc_edit = QTextEdit()
        self.desc_edit.setPlaceholderText("Short 1-2 sentence description")
        desc_layout.addWidget(self.desc_edit)
        self.gen_desc_btn = QPushButton("Generate Description (OpenAI)")
        self.gen_desc_btn.clicked.connect(self.generate_description)
        desc_layout.addWidget(self.gen_desc_btn)
        layout.addLayout(desc_layout)
        # Features
        features_layout = QHBoxLayout()
        self.features_edit = QLineEdit()
        self.features_edit.setPlaceholderText("Key features (comma separated)")
        features_layout.addWidget(self.features_edit)
        self.gen_features_btn = QPushButton("Generate Features (OpenAI)")
        self.gen_features_btn.clicked.connect(self.generate_features)
        features_layout.addWidget(self.gen_features_btn)
        layout.addLayout(features_layout)
        # Capsules
        capsules_layout = QHBoxLayout()
        self.capsules_edit = QLineEdit()
        self.capsules_edit.setPlaceholderText("Capsules (comma separated, up to 3)")
        capsules_layout.addWidget(self.capsules_edit)
        self.gen_capsules_btn = QPushButton("Generate Capsules (OpenAI)")
        self.gen_capsules_btn.clicked.connect(self.generate_capsules)
        capsules_layout.addWidget(self.gen_capsules_btn)
        layout.addLayout(capsules_layout)
        # Custom Prompt
        prompt_layout = QHBoxLayout()
        self.prompt_edit = QLineEdit()
        self.prompt_edit.setPlaceholderText("Custom prompt (optional)")
        prompt_layout.addWidget(self.prompt_edit)
        layout.addLayout(prompt_layout)
        # OpenAI API key and model selection
        api_layout = QHBoxLayout()
        self.api_btn = QPushButton("Set OpenAI API Key")
        self.api_btn.clicked.connect(self.set_api_key)
        api_layout.addWidget(self.api_btn)
        self.model_box = QComboBox()
        self.model_box.addItems(["gpt-4", "gpt-4o", "o4-mini", "gpt-3.5-turbo"])
        self.model_box.setCurrentText("o4-mini")
        api_layout.addWidget(QLabel("Model:"))
        api_layout.addWidget(self.model_box)
        layout.addLayout(api_layout)
        # Save/next/prev
        nav_layout = QHBoxLayout()
        self.save_btn = QPushButton("Save to CSV")
        self.save_btn.clicked.connect(self.save_to_csv)
        nav_layout.addWidget(self.save_btn)
        self.prev_btn = QPushButton("Previous")
        self.prev_btn.clicked.connect(self.prev_entry)
        nav_layout.addWidget(self.prev_btn)
        self.next_btn = QPushButton("Next")
        self.next_btn.clicked.connect(self.next_entry)
        nav_layout.addWidget(self.next_btn)
        layout.addLayout(nav_layout)
        self.setLayout(layout)

    def show_entry(self):
        row = self.df.iloc[self.current_index]
        text = (
            f"<b>Row {self.current_index+1} of {len(self.df)}</b><br>"
            f"<b>Category:</b> {row.get('Category', '')}<br>"
            f"<b>Platform Name:</b> {row.get('Platform Name', '')}<br>"
            f"<b>Official Website:</b> {row.get('Official Website', '')}<br>"
            f"<b>Referral Link:</b> {row.get('Referral Link', '')}<br>"
            f"<b>Notes:</b> {row.get('Notes', '')}<br>"
            f"<b>Status:</b> {row.get('Status', '')}<br>"
        )
        self.entry_label.setText(text)
        # Handle logo: if CSV has a logo filename, set self.logo_paths
        logo_filename = str(row.get('Logo', '')).strip()
        if logo_filename:
            logo_path = os.path.join(LOGO_DIR, logo_filename)
            if os.path.exists(logo_path):
                self.logo_paths[self.current_index] = logo_path
            else:
                self.logo_paths[self.current_index] = ''
        else:
            self.logo_paths[self.current_index] = ''
        self.display_logo()
        self.website_edit.setText(str(row.get('Official Website', "")))
        self.referral_edit.setText(str(row.get('Referral Link', "")))
        self.desc_edit.setText(str(row.get('Description', "")))
        self.features_edit.setText(str(row.get('Features', "")))
        self.capsules_edit.setText(str(row.get('capsules', "")))
        # Show favicon for current platform
        favicon_filename = str(row.get('favicon', '')).strip()
        if favicon_filename and os.path.exists(os.path.join(FAVICON_DIR, favicon_filename)):
            pixmap = QPixmap()
            pixmap.load(os.path.join(FAVICON_DIR, favicon_filename))
            self.favicon_label.setPixmap(pixmap.scaled(32, 32, Qt.KeepAspectRatio, Qt.SmoothTransformation))
        else:
            self.favicon_label.clear()

    def display_logo(self):
        logo_path = self.logo_paths[self.current_index]
        if logo_path and os.path.exists(logo_path):
            pixmap = QPixmap(logo_path)
            self.logo_label.setPixmap(pixmap.scaled(100, 100, Qt.KeepAspectRatio, Qt.SmoothTransformation))
        else:
            self.logo_label.setText("No logo")

    def search_logo_online(self):
        row = self.df.iloc[self.current_index]
        platform_name = row.get('Platform Name', '')
        query = f"{platform_name} logo"
        url = f"https://www.google.com/search?tbm=isch&q={query.replace(' ', '+')}"
        webbrowser.open(url)

    def paste_logo_clipboard(self):
        clipboard = QGuiApplication.clipboard()
        mime = clipboard.mimeData()
        if mime.hasImage():
            image = clipboard.image()
            if not image.isNull():
                row = self.df.iloc[self.current_index]
                platform_name = safe_platform_name(row.get('Platform Name', ''))
                logo_filename = f"logo_{platform_name}.png"
                save_path = os.path.join(LOGO_DIR, logo_filename)
                os.makedirs(LOGO_DIR, exist_ok=True)
                image.save(save_path, "PNG")
                self.logo_paths[self.current_index] = save_path
                self.display_logo()
                self.logo_status.setText(f"Logo pasted and saved as {logo_filename}")
                return
        self.logo_status.setText("No image found in clipboard.")

    def download_logo_from_url(self):
        url, ok = QInputDialog.getText(self, "Download Logo", "Paste image URL:")
        if ok and url:
            try:
                response = requests.get(url, timeout=10)
                response.raise_for_status()
                img = Image.open(io.BytesIO(response.content))
                row = self.df.iloc[self.current_index]
                platform_name = safe_platform_name(row.get('Platform Name', ''))
                logo_filename = f"logo_{platform_name}.png"
                save_path = os.path.join(LOGO_DIR, logo_filename)
                os.makedirs(LOGO_DIR, exist_ok=True)
                img.save(save_path)
                self.logo_paths[self.current_index] = save_path
                self.display_logo()
                self.logo_status.setText(f"Logo downloaded and saved as {logo_filename}")
            except Exception as e:
                self.logo_status.setText(f"Failed to download image: {e}")

    def upload_logo(self):
        row = self.df.iloc[self.current_index]
        platform_name = safe_platform_name(row.get('Platform Name', ''))
        file_path, _ = QFileDialog.getOpenFileName(self, "Select Logo Image", "", "Image Files (*.png *.jpg *.jpeg *.bmp)")
        if file_path:
            ext = os.path.splitext(file_path)[1]
            logo_filename = f"logo_{platform_name}{ext}"
            save_path = os.path.join(LOGO_DIR, logo_filename)
            os.makedirs(LOGO_DIR, exist_ok=True)
            with open(file_path, "rb") as src, open(save_path, "wb") as dst:
                dst.write(src.read())
            self.logo_paths[self.current_index] = save_path
            self.display_logo()
            self.logo_status.setText(f"Logo saved as {logo_filename}")

    def open_website(self):
        url = self.website_edit.text().strip()
        if url:
            webbrowser.open(url)
        else:
            self.logo_status.setText("No official website URL found.")

    def open_referral(self):
        url = self.referral_edit.text().strip()
        if url:
            webbrowser.open(url)
        else:
            self.logo_status.setText("No referral link found.")

    def set_api_key(self):
        key, ok = QInputDialog.getText(self, "OpenAI API Key", "Enter your OpenAI API key:", QLineEdit.Password)
        if ok and key:
            self.api_key = key
            if openai:
                try:
                    client = openai.OpenAI(api_key=key)
                    client.models.list()
                    self.logo_status.setText("OpenAI API key set and validated.")
                except Exception as e:
                    self.logo_status.setText(f"Key set, but validation failed: {e}")

    def generate_description(self):
        if not self.api_key or not openai:
            self.logo_status.setText("Set your OpenAI API key first.")
            return
        row = self.df.iloc[self.current_index]
        prompt = self.prompt_edit.text().strip()
        if not prompt:
            prompt = (
                f"Write a single, concise sentence (max 25 words) summarizing the crypto platform: "
                f"{row.get('Platform Name', '')}. Website: {self.website_edit.text().strip()}"
            )
        try:
            model = self.model_box.currentText()
            client = openai.OpenAI(api_key=self.api_key)
            params = dict(
                model=model,
                messages=[{"role": "user", "content": prompt}],
            )
            if model == 'o4-mini':
                pass  # do not send temperature
            else:
                params['temperature'] = 0.7
            if model == 'o4-mini':
                params['max_completion_tokens'] = 60
            else:
                params['max_tokens'] = 60
            response = client.chat.completions.create(**params)
            summary = response.choices[0].message.content.strip()
            self.desc_edit.setText(summary)
        except Exception as e:
            self.logo_status.setText(f"OpenAI Error: {e}")

    def generate_features(self):
        if not self.api_key or not openai:
            self.logo_status.setText("Set your OpenAI API key first.")
            return
        row = self.df.iloc[self.current_index]
        prompt = self.prompt_edit.text().strip()
        if not prompt:
            prompt = (
                f"List 4 to 6 key features of the crypto platform: "
                f"{row.get('Platform Name', '')}. Website: {self.website_edit.text().strip()}. "
                f"Each feature should be 3-8 words, comma-separated, and describe a real capability or benefit. "
                f"Do NOT use numbers, bullets, or single-word tags."
            )
        try:
            model = self.model_box.currentText()
            client = openai.OpenAI(api_key=self.api_key)
            params = dict(
                model=model,
                messages=[{"role": "user", "content": prompt}],
            )
            if model == 'o4-mini':
                pass  # do not send temperature
            else:
                params['temperature'] = 0.7
            if model == 'o4-mini':
                params['max_completion_tokens'] = 80
            else:
                params['max_tokens'] = 80
            response = client.chat.completions.create(**params)
            features = response.choices[0].message.content.strip().replace('"', '')
            features = features.replace('\n', ',').replace('•', '').replace('-', '')
            features = ','.join(f.strip().lstrip('0123456789. ') for f in features.split(',') if f.strip())
            self.features_edit.setText(features)
        except Exception as e:
            self.logo_status.setText(f"OpenAI Error: {e}")

    def generate_capsules(self):
        import random
        if not self.api_key or not openai:
            self.logo_status.setText("Set your OpenAI API key first.")
            return
        row = self.df.iloc[self.current_index]
        n_capsules = random.choices([2, 3], weights=[0.7, 0.3])[0]
        prompt = self.prompt_edit.text().strip()
        if not prompt:
            prompt = (
                f"Generate {n_capsules} extremely concise, unique feature tags for the crypto platform: "
                f"{row.get('Platform Name', '')}. Website: {self.website_edit.text().strip()}. "
                f"Each tag should be 1-3 words (prefer 1-2), comma-separated, and highlight distinctive or main features. "
                f"DO NOT include numbers or bullet points, just comma-separated text."
            )
        try:
            model = self.model_box.currentText()
            client = openai.OpenAI(api_key=self.api_key)
            params = dict(
                model=model,
                messages=[{"role": "user", "content": prompt}],
            )
            if model == 'o4-mini':
                pass  # do not send temperature
            else:
                params['temperature'] = 0.8
            if model == 'o4-mini':
                params['max_completion_tokens'] = 32
            else:
                params['max_tokens'] = 32
            response = client.chat.completions.create(**params)
            capsules = response.choices[0].message.content.strip().replace('"', '')
            capsules = capsules.replace('\n', ',').replace('•', '').replace('-', '')
            capsules = ','.join(c.strip().lstrip('0123456789. ') for c in capsules.split(',') if c.strip())
            self.capsules_edit.setText(capsules)
        except Exception as e:
            self.logo_status.setText(f"OpenAI Error: {e}")

    def save_to_csv(self):
        try:
            df_full = pd.read_csv(CSV_FILE)
            row = self.df.iloc[self.current_index]
            platform_name = row.get('Platform Name', '')
            website = self.website_edit.text().strip()
            referral = self.referral_edit.text().strip()
            match = (df_full['Platform Name'] == platform_name) & (df_full['Official Website'] == row.get('Official Website', ''))
            idxs = df_full.index[match].tolist()
            if not idxs:
                raise Exception('Could not find matching row in CSV for save!')
            idx = idxs[0]
            # Clean up fields
            def clean(val):
                if pd.isna(val) or val == 'nan' or val == '""':
                    return ''
                if isinstance(val, str) and val.startswith('"') and val.endswith('"'):
                    return val[1:-1]
                return val
            df_full.at[idx, 'Official Website'] = clean(website)
            df_full.at[idx, 'Referral Link'] = clean(referral)
            df_full.at[idx, 'Description'] = clean(self.desc_edit.toPlainText())
            # Properly clean features/capsules: split on commas, preserve all spaces inside tags
            def clean_commas(val):
                if not isinstance(val, str):
                    return ''
                tags = [t.strip().replace('"', '').replace("'", '') for t in re.split(r',', val) if t.strip()]
                return ','.join(tags)
            features = clean_commas(self.features_edit.text())
            capsules = clean_commas(self.capsules_edit.text())
            df_full.at[idx, 'Features'] = features
            df_full.at[idx, 'capsules'] = capsules
            # Handle logo: if no new logo, use existing CSV value
            logo_path = self.logo_paths[self.current_index]
            if logo_path:
                logo_filename = os.path.basename(logo_path)
            else:
                logo_filename = str(row.get('Logo', '')).strip()
            df_full.at[idx, 'Logo'] = clean(logo_filename)
            df_full.to_csv(CSV_FILE, index=False)
            self.logo_status.setText("Saved to CSV!")
        except Exception as e:
            self.logo_status.setText(f"Failed to save: {str(e)}")

    def prev_entry(self):
        if self.current_index > 0:
            self.current_index -= 1
            self.show_entry()

    def next_entry(self):
        if self.current_index < len(self.df) - 1:
            self.current_index += 1
            self.show_entry()

    def website_verify_action(self):
        self.website_verified[self.current_index] = True
        self.website_check.setText('✅')
        self.logo_status.setText('Website verified!')

    def get_favicon_from_website(self):
        if not self.website_verified[self.current_index]:
            self.logo_status.setText('Please verify the website first!')
            return
        self.verify_website_and_favicon()

    def verify_website_and_favicon(self):
        url = self.website_edit.text().strip()
        row = self.df.iloc[self.current_index]
        platform_name = safe_platform_name(row.get('Platform Name', ''))
        if not url:
            self.logo_status.setText("No official website URL found.")
            return
        # Try to fetch favicon
        try:
            # Try the standard /favicon.ico first
            if not url.startswith('http'):
                url = 'https://' + url
            base_url = url.split('/')[2]
            favicon_url = f"https://{base_url}/favicon.ico"
            r = requests.get(favicon_url, timeout=6)
            content_type = r.headers.get('content-type', '')
            if r.status_code == 200 and r.content and 'image' in content_type:
                favicon_data = r.content
            else:
                # Try to parse <link rel="icon"> from HTML
                r_html = requests.get(url, timeout=6)
                from bs4 import BeautifulSoup
                soup = BeautifulSoup(r_html.text, 'html.parser')
                icon_link = soup.find('link', rel=lambda x: x and 'icon' in x.lower())
                if icon_link and icon_link.get('href'):
                    icon_href = icon_link['href']
                    if icon_href.startswith('//'):
                        icon_url = 'https:' + icon_href
                    elif icon_href.startswith('http'):
                        icon_url = icon_href
                    else:
                        icon_url = f"https://{base_url}/{icon_href.lstrip('/')}"
                    r_icon = requests.get(icon_url, timeout=6)
                    icon_content_type = r_icon.headers.get('content-type', '')
                    if r_icon.status_code == 200 and r_icon.content and 'image' in icon_content_type:
                        favicon_data = r_icon.content
                    else:
                        self.logo_status.setText("Favicon not found or not an image.")
                        return
                else:
                    self.logo_status.setText("Favicon not found.")
                    return
            # Always save as PNG
            try:
                from PIL import Image
                import io
                img = Image.open(io.BytesIO(favicon_data))
                png_path = os.path.join(FAVICON_DIR, f"fav_{platform_name}.png")
                img.save(png_path, format='PNG')
                favicon_filename = f"fav_{platform_name}.png"
                favicon_path = png_path
                self.update_favicon_csv_and_ui(favicon_filename, favicon_path)
                self.logo_status.setText(f"Favicon saved as {favicon_filename}")
            except Exception as e:
                self.logo_status.setText(f"Favicon error: {e}")
        except Exception as e:
            self.logo_status.setText(f"Favicon error: {e}")

    def paste_favicon_clipboard(self):
        clipboard = QGuiApplication.clipboard()
        mime = clipboard.mimeData()
        if mime.hasImage():
            image = clipboard.image()
            if not image.isNull():
                row = self.df.iloc[self.current_index]
                platform_name = safe_platform_name(row.get('Platform Name', ''))
                favicon_filename = f"fav_{platform_name}.png"
                save_path = os.path.join(FAVICON_DIR, favicon_filename)
                os.makedirs(FAVICON_DIR, exist_ok=True)
                image.save(save_path, "PNG")
                self.update_favicon_csv_and_ui(favicon_filename, save_path)
                self.logo_status.setText(f"Favicon pasted and saved as {favicon_filename}")
                return
        self.logo_status.setText("No image found in clipboard.")

    def upload_favicon(self):
        row = self.df.iloc[self.current_index]
        platform_name = safe_platform_name(row.get('Platform Name', ''))
        file_path, _ = QFileDialog.getOpenFileName(self, "Select Favicon Image", "", "Image Files (*.ico *.png *.jpg *.jpeg *.bmp)")
        if file_path:
            from PIL import Image
            img = Image.open(file_path)
            favicon_filename = f"fav_{platform_name}.png"
            save_path = os.path.join(FAVICON_DIR, favicon_filename)
            os.makedirs(FAVICON_DIR, exist_ok=True)
            img.save(save_path, format='PNG')
            self.update_favicon_csv_and_ui(favicon_filename, save_path)
            self.logo_status.setText(f"Favicon saved as {favicon_filename}")

    def update_favicon_csv_and_ui(self, favicon_filename, favicon_path):
        # Update CSV
        row = self.df.iloc[self.current_index]
        df_full = pd.read_csv(CSV_FILE)
        # Ensure favicon column is string type
        if 'favicon' not in df_full.columns:
            df_full['favicon'] = ''
        else:
            df_full['favicon'] = df_full['favicon'].astype(str)
        match = (df_full['Platform Name'] == row.get('Platform Name', '')) & (df_full['Official Website'] == row.get('Official Website', ''))
        idxs = df_full.index[match].tolist()
        if idxs:
            idx = idxs[0]
            df_full.at[idx, 'favicon'] = favicon_filename
            # Force favicon column to string before saving
            df_full['favicon'] = df_full['favicon'].astype(str)
            df_full.to_csv(CSV_FILE, index=False)
        # Show favicon in UI
        pixmap = QPixmap()
        pixmap.load(favicon_path)
        self.favicon_label.setPixmap(pixmap.scaled(32, 32, Qt.KeepAspectRatio, Qt.SmoothTransformation))

if __name__ == "__main__":
    # Make a backup
    shutil.copyfile(__file__, os.path.join(os.path.dirname(__file__), 'app2_backup.py'))
    app = QApplication(sys.argv)
    window = RefLinksApp()
    window.show()
    sys.exit(app.exec_())
