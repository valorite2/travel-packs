document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');

    if (navToggle && navList) {
        navToggle.addEventListener('click', () => {
            navList.classList.toggle('active');
            // Cambiar el icono de hamburguesa a cruz y viceversa
            const icon = navToggle.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                navToggle.setAttribute('aria-label', 'Cerrar menú');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                navToggle.setAttribute('aria-label', 'Abrir menú');
            }
        });

        // Opcional: Cerrar el menú si se hace clic fuera de él en móviles
        // Esta funcionalidad es un poco más compleja y podría necesitar un poco más de lógica
        // para asegurar que no interfiera con otros clics.
        // Por simplicidad, no la incluiremos en este ejemplo básico.

        // Opcional: Cerrar el menú al hacer clic en un enlace (útil en SPA o secciones)
        navList.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) { // Solo si estamos en vista móvil
                    navList.classList.remove('active');
                    const icon = navToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    navToggle.setAttribute('aria-label', 'Abrir menú');
                }
            });
        });
    }
});
//cuadro del buscador
function buscar() {
  const origen = document.getElementById("origen").value;
  const destino = document.getElementById("destino").value;
  const entrada = document.getElementById("fecha-entrada").value;
  const salida = document.getElementById("fecha-salida").value;

  alert(`Buscando paquetes de ${origen} a ${destino} del ${entrada} al ${salida}`);
}