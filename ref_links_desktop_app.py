# Capsules
capsules_layout = QHBoxLayout()
self.capsules_edit = QLineEdit()
self.capsules_edit.setPlaceholderText("Capsules (comma separated, up to 3)")
capsules_layout.addWidget(self.capsules_edit)

self.gen_capsules_btn = QPushButton("Generate Capsules (OpenAI)")
self.gen_capsules_btn.clicked.connect(self.generate_capsules)
capsules_layout.addWidget(self.gen_capsules_btn)

self.verify_capsules_btn = QPushButton("Verify Capsules")
self.verify_capsules_btn.clicked.connect(self.verify_capsules)
capsules_layout.addWidget(self.verify_capsules_btn)

self.capsules_check = QLabel()
capsules_layout.addWidget(self.capsules_check)

layout.addLayout(capsules_layout)

# Custom Prompt
prompt_layout = QHBoxLayout()
self.prompt_edit = QLineEdit()
self.prompt_edit.setPlaceholderText("Custom prompt (optional)")
prompt_layout.addWidget(self.prompt_edit)
self.use_prompt_btn = QPushButton("Use Prompt for Next Generation")
self.use_prompt_btn.clicked.connect(self.use_custom_prompt)
prompt_layout.addWidget(self.use_prompt_btn)
layout.addLayout(prompt_layout)

# ... rest of init_ui ...

def show_entry(self):
    row = self.df.iloc[self.current_index]
    # ... existing code ...
    self.capsules_edit.setText(str(row.get('capsules', "")))
    # ... existing code ...

def generate_capsules(self):
    import random
    if not self.api_key or not openai:
        QMessageBox.warning(self, "OpenAI", "Set your OpenAI API key first.")
        return
    row = self.df.iloc[self.current_index]
    n_capsules = random.choices([2, 3], weights=[0.7, 0.3])[0]
    prompt = self.prompt_edit.text().strip()
    if not prompt:
        prompt = (
            f"Generate {n_capsules} extremely concise, unique feature tags for the crypto platform: "
            f"{row.get('Platform Name', '')}. Website: {row.get('Official Website', '')}. "
            f"Each tag should be 1-3 words (prefer 1-2), comma-separated, and highlight distinctive or main features."
        )
    try:
        client = openai.OpenAI(api_key=self.api_key)
        response = client.chat.completions.create(
            model=self.model_box.currentText(),
            messages=[{"role": "user", "content": prompt}],
            max_tokens=32,
            temperature=0.8,
        )
        capsules = response.choices[0].message.content.strip()
        self.capsules_edit.setText(capsules)
    except Exception as e:
        QMessageBox.critical(self, "OpenAI Error", str(e))

def verify_capsules(self):
    self.verified[self.current_index]["capsules"] = True
    self.update_checks()
    self.save_btn.setEnabled(all(self.verified[self.current_index].values()))

def use_custom_prompt(self):
    QMessageBox.information(self, "Custom Prompt", "Your custom prompt will be used for the next OpenAI generation.")

def save_to_csv(self):
    # Save all verified entries to CSV
    desc = self.desc_edit.toPlainText()
    features = self.features_edit.text()
    capsules = self.capsules_edit.text()
    logo_path = self.logo_paths[self.current_index]
    logo_filename = os.path.basename(logo_path) if logo_path else ""
    self.df.at[self.current_index, "Description"] = desc
    self.df.at[self.current_index, "Features"] = features
    self.df.at[self.current_index, "capsules"] = capsules
    self.df.at[self.current_index, "Logo"] = logo_filename
    self.df.to_csv(CSV_OUT, index=False)
    QMessageBox.information(self, "Saved", f"Saved to {CSV_OUT}")
# ... existing code ... 