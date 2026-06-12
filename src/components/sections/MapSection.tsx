import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Reveal } from '../common/Reveal';
import { Divider } from '../common/Divider';
import { LOVE } from '../../config/love';

/**
 * Mapa interactivo (Leaflet + OpenStreetMap) con marcador en forma
 * de corazón pulsante sobre el lugar de la cita: Pimentel, Chiclayo.
 */
export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const { lat, lng, message, date, place } = LOVE.firstDate;

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 14,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(map);

    const heartIcon = L.divIcon({
      className: 'heart-marker',
      html: '<div class="pulse">❤️</div>',
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -20],
    });

    L.marker([lat, lng], { icon: heartIcon, title: place })
      .addTo(map)
      .bindPopup(
        `<strong style="font-family: var(--font-hand); font-size: 1.15rem; color: var(--burgundy);">Nuestra cita · ${date}</strong><br/><span style="font-size: 0.82rem;">${message}</span>`,
      )
      .openPopup();

    return () => {
      map.remove();
    };
  }, []);

  return (
    <section aria-label="El lugar de nuestra cita">
      <Reveal>
        <p className="section-kicker">{LOVE.firstDate.date}</p>
        <h2 className="script-title">Donde todo cobra sentido</h2>
        <Divider />
        <p className="section-sub">{LOVE.firstDate.place} — el escenario de nuestra cita.</p>
      </Reveal>

      <Reveal delay={0.15}>
        <div
          style={{
            marginTop: '1.6rem',
            borderRadius: 18,
            overflow: 'hidden',
            border: '1px solid var(--rose-light)',
            boxShadow: '0 16px 36px rgba(110, 15, 44, 0.15)',
          }}
        >
          <div ref={mapRef} style={{ height: 340, width: '100%' }} aria-label="Mapa de Pimentel" />
        </div>
      </Reveal>
    </section>
  );
}
