// Importa createClient directamente desde el CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Tus credenciales de Supabase
const SUPABASE_URL = 'https://cywsonaxzsfixwtdazgm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5d3NvbmF4enNmaXh3dGRhemdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MzE0MzksImV4cCI6MjA2NTUwNzQzOX0.yjYAW2Lvc_z3TdsGendoQXXu1Bj_3aZMGkJezCuY8Fo';

// Inicializa el cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ======================================
// Lógica para la página de Subir Artículo (upload.html)
// ======================================
document.addEventListener('DOMContentLoaded', () => {
    const uploadForm = document.getElementById('upload-form');
    const uploadMessageElement = document.getElementById('upload-message');

    // Función para mostrar mensajes específicos de la página de subida
    function showMessageUpload(message, type = 'success') {
        if (uploadMessageElement) {
            uploadMessageElement.textContent = message;
            uploadMessageElement.style.color = type === 'success' ? 'green' : 'red';
            uploadMessageElement.style.display = 'block';
            setTimeout(() => {
                uploadMessageElement.style.display = 'none';
            }, 5000);
        }
    }

    if (uploadForm) { // Asegurarse de que el formulario exista en la página actual
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const tipoArticulo = document.getElementById('tipo-articulo').value;
            const descripcionArticulo = document.getElementById('descripcion-articulo').value.trim();
            const fechaArticulo = document.getElementById('fecha-articulo').value;
            const imagenArticuloInput = document.getElementById('imagen-articulo');
            const imagenArticulo = imagenArticuloInput.files[0]; // El archivo de imagen

            if (!tipoArticulo || !descripcionArticulo || !fechaArticulo || !imagenArticulo) {
                showMessageUpload('Por favor, completa todos los campos y selecciona una imagen.', 'error');
                return;
            }

            showMessageUpload('Subiendo artículo y imagen...', 'black');

            try {
                // 1. Subir la imagen a Supabase Storage
                const fileExtension = imagenArticulo.name.split('.').pop();
                // Generar un nombre de archivo único para evitar colisiones
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`; 
                const filePath = `public/${fileName}`; // Carpeta 'public' dentro de tu bucket 'articulos-imagenes'

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('articulos-imagenes') // Usa el nombre de tu bucket de Supabase Storage
                    .upload(filePath, imagenArticulo, {
                        cacheControl: '3600',
                        upsert: false // No sobrescribir si ya existe
                    });

                if (uploadError) {
                    console.error('Error al subir la imagen:', uploadError);
                    showMessageUpload(`Error al subir la imagen: ${uploadError.message}`, 'error');
                    return;
                }

                // Obtener la URL pública de la imagen
                const { data: publicUrlData } = supabase.storage
                    .from('articulos-imagenes')
                    .getPublicUrl(uploadData.path);
                
                const imageUrl = publicUrlData.publicUrl;

                // 2. Insertar los datos del artículo en la tabla 'articulo'
                const { data: insertData, error: insertError } = await supabase
                    .from('articulo') // Tu tabla de artículos en Supabase
                    .insert([
                        { 
                            tipo_articulo: tipoArticulo,
                            descripcion: descripcionArticulo,
                            fecha: fechaArticulo,
                            imagen_url: imageUrl // Guardamos la URL de la imagen en la nueva columna
                        }
                    ]);

                if (insertError) {
                    console.error('Error al insertar el artículo:', insertError);
                    showMessageUpload(`Error al insertar el artículo: ${insertError.message}`, 'error');
                    return;
                }

                showMessageUpload('Artículo subido exitosamente!', 'success');
                uploadForm.reset(); // Limpiar el formulario
                imagenArticuloInput.value = ''; // Limpiar el input de archivo

            } catch (err) {
                console.error('Error inesperado al subir el artículo:', err);
                showMessageUpload('Ocurrió un error inesperado al subir el artículo.', 'error');
            }
        });
    }
});