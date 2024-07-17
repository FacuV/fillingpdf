"use client"
import { useState, useEffect } from 'react';
import { PDFCheckBox, PDFDocument, PDFTextField } from 'pdf-lib';
import { saveAs } from 'file-saver';
import InputField from './InputField';
import PdfViewer from './PdfViewer';

const FillPdfForm = () => {
  const [formData, setFormData] = useState({});
  const [fieldIds, setFieldIds] = useState([]);
  const [updatedPdfUrl, setUpdatedPdfUrl] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      setPdfFile(arrayBuffer);
      getFieldIds(arrayBuffer);
    }
  };

  const getFieldIds = async (arrayBuffer) => {
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    const ids = fields.map(field => field.getName());
    setFieldIds(ids);
  };

  const fillPdf = async (data) => {
    if (!pdfFile) return;

    const pdfDoc = await PDFDocument.load(pdfFile);
    const form = pdfDoc.getForm();

    fieldIds.forEach(id => {
      const field = form.getField(id);

      if (field) {
        if (field instanceof PDFTextField) {
          field.setText(data[id] || '');
        } else if (field instanceof PDFCheckBox) {
          const isChecked = data[id] === 'true'; // o cualquier lógica que uses
          field.check(isChecked);
        }
      }
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setUpdatedPdfUrl(pdfUrl);
  };

  useEffect(() => {
    if (fieldIds.length > 0) {
      fillPdf(formData);
    }
  }, [formData, fieldIds]);

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 p-4 bg-white shadow-md rounded-lg">
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4" />
        {fieldIds.map(id => (
          <InputField
            key={id}
            id={id}
            value={formData[id] || ''}
            handleChange={handleChange}
          />
        ))}
        <button
          onClick={() => saveAs(updatedPdfUrl, 'form_filled.pdf')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Descargar PDF
        </button>
      </div>
      <div className="w-full md:w-1/2 p-4">
        {updatedPdfUrl && <PdfViewer pdfUrl={updatedPdfUrl} />}
      </div>
    </div>
  );
};

export default FillPdfForm;
