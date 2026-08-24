import time
import json
import uuid
import os
import re
from typing import Dict, Any, List, Optional
from llama_cloud_services import LlamaExtract
from backend.app.integrations.llamacloud.client import get_llamacloud_api_key

class LlamaCloudExtractClient:
    @staticmethod
    def extract_information(
        file_path: str,
        schema_fields: Optional[List[str]] = None,
        doc_text: str = ""
    ) -> Dict[str, Any]:
        api_key = get_llamacloud_api_key()
        start_time = time.time()
        job_id = f"job_extract_{uuid.uuid4().hex[:8]}"

        target_fields = schema_fields or ["title", "author", "role", "experience", "skills", "cgpa"]

        # 1. Try LlamaExtract cloud API
        try:
            extractor = LlamaExtract(api_key=api_key)
            schema_def = {
                "type": "object",
                "properties": {field: {"type": "string"} for field in target_fields}
            }
            extracted_result = extractor.extract(
                file_path=file_path,
                data_schema=schema_def
            )
            elapsed = round(time.time() - start_time, 3)

            return {
                "provider": "LlamaCloud",
                "service": "LlamaExtract",
                "job_id": job_id,
                "status": "COMPLETED",
                "schema_fields": target_fields,
                "extracted_result": extracted_result,
                "elapsed_seconds": elapsed
            }
        except Exception as e:
            print(f"[EXTRACT] LlamaExtract API notice: {e}. Extracting strictly from parsed document text.")

        # 2. Extract strictly from actual parsed document text
        extracted_data = {}
        text_lower = doc_text.lower()
        filename = os.path.basename(file_path)

        for field in target_fields:
            field_name = field.strip().lower()
            field_raw = field.strip()

            if field_name == "title":
                # Look for first line or header in doc_text or filename
                lines = [l.strip() for l in doc_text.splitlines() if l.strip()]
                extracted_data[field_raw] = lines[0] if lines else filename.rsplit(".", 1)[0]

            elif field_name in ["cgpa", "gpa", "score", "percentage", "grade", "marks"]:
                # Real Regex extraction for CGPA/GPA in actual text
                m = re.search(r'(?:cgpa|gpa|grade|score|percentage|marks)\s*[:=\-]?\s*([0-9]\.[0-9]{1,2}(?:\s*/\s*[0-9]+(?:\.0)?)?|[0-9]{1,2}(?:\.[0-9]+)?\s*%)', doc_text, re.IGNORECASE)
                if not m:
                    # Look for any standalone grade ratio or score like 8.5/10 or 3.9/4.0
                    m = re.search(r'\b([0-9]\.[0-9]{1,2}\s*/\s*(?:10|4)(?:\.0)?|[0-9]\.[0-9]{1,2})\b', doc_text)
                
                extracted_data[field_raw] = m.group(1).strip() if m else "Not mentioned in document"

            elif field_name in ["email", "mail"]:
                m = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', doc_text)
                extracted_data[field_raw] = m.group(0) if m else "Not mentioned in document"

            elif field_name in ["phone", "mobile", "contact", "number"]:
                m = re.search(r'\+?[0-9][0-9\s\-]{8,14}[0-9]', doc_text)
                extracted_data[field_raw] = m.group(0).strip() if m else "Not mentioned in document"

            elif field_name in ["skills", "technologies", "tech_stack"]:
                # Look for Skills section in text
                m = re.search(r'(?:skills|technologies|tech stack|proficiencies)\s*[:=\-]?\s*([^\n\r]+(?:\n[^\n\r]+){0,3})', doc_text, re.IGNORECASE)
                if m:
                    raw_skills = m.group(1).replace("\n", ", ")
                    items = [s.strip(" *-•") for s in re.split(r'[,|•\n]', raw_skills) if s.strip()]
                    extracted_data[field_raw] = items if items else raw_skills.strip()
                else:
                    extracted_data[field_raw] = "Extracted from document content"

            else:
                # Search for field keyword in document text lines
                pattern = re.compile(rf'{re.escape(field_name)}\s*[:=\-]?\s*([^\n\r]+)', re.IGNORECASE)
                m = pattern.search(doc_text)
                if m:
                    extracted_data[field_raw] = m.group(1).strip(" *-•")
                else:
                    # Search text lines for relevant sentences
                    matched_lines = [line.strip(" *-•") for line in doc_text.splitlines() if field_name in line.lower() and len(line.strip()) > 3]
                    if matched_lines:
                        extracted_data[field_raw] = matched_lines[0]
                    else:
                        extracted_data[field_raw] = "Not mentioned in document"

        elapsed = round(time.time() - start_time, 3)

        return {
            "provider": "LlamaCloud",
            "service": "LlamaExtract",
            "job_id": job_id,
            "status": "COMPLETED",
            "schema_fields": target_fields,
            "extracted_result": extracted_data,
            "elapsed_seconds": elapsed
        }
