# Chroma

A wavelength bench for the CIE 1931 2° standard observer, in 5 nm steps from 380 nm to 780 nm. XYZ becomes linear sRGB with the IEC 61966-2-1 matrix. Values outside 0 to 1 are clipped, then the sRGB curve is applied.

555 nm clips to bytes 97, 255, 0. 650 nm clips to bytes 225, 0, 0. The bench has no score. A clipped patch is not a claim that the spectral color sits inside sRGB.

Open `play/index.html`.

Built with Grok Build. MIT.
