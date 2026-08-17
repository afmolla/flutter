/*------------------------------------------------------------------------
  ACIL versiyon - liste hemen gelsin diye

  p-ham-stok = NO  -> Hammadde stok kolonu bos/0 (1-3 dk, diger kolonlar dolu)
  p-ham-stok = YES -> stok_hareket tek gecis ile ay sonu stok da hesaplanir

  Once NO ile calistir, listeyi al. Sonra YES ile stok kolonunu doldurursun.

  RUN "excel yardim ham-aylik-ozet-acil.p".
  veya stok dahil:
  RUN ham-aylik-ozet-acil (INPUT "100", INPUT 09/01/2025, INPUT 08/31/2026, INPUT "CSV", INPUT YES).
------------------------------------------------------------------------*/

DEFINE VARIABLE p-firma-kod      AS CHARACTER NO-UNDO INIT "100".
DEFINE VARIABLE p-bas-tarih      AS DATE      NO-UNDO INIT 09/01/2025.
DEFINE VARIABLE p-bit-tarih      AS DATE      NO-UNDO INIT 08/31/2026.
DEFINE VARIABLE p-export-mode    AS CHARACTER NO-UNDO INIT "CSV".
DEFINE VARIABLE p-ham-stok-hesap AS LOGICAL   NO-UNDO INIT NO.
DEFINE VARIABLE p-csv-dosya      AS CHARACTER NO-UNDO INIT "".
DEFINE VARIABLE p-log-dosya      AS CHARACTER NO-UNDO INIT "C:\Users\ahmetfaruk.mollaoglu\Desktop\ham-aylik-run.log".

DEFINE VARIABLE v-ay-bas         AS DATE      NO-UNDO.
DEFINE VARIABLE v-i              AS INTEGER   NO-UNDO.
DEFINE VARIABLE v-ay-adet        AS INTEGER   NO-UNDO.
DEFINE VARIABLE v-row            AS INTEGER   NO-UNDO.
DEFINE VARIABLE v-yil            AS INTEGER   NO-UNDO.
DEFINE VARIABLE v-ay             AS INTEGER   NO-UNDO.
DEFINE VARIABLE v-son            AS DATE      NO-UNDO.

DEFINE TEMP-TABLE tt-ham NO-UNDO
    FIELD stok_kod AS CHARACTER
    INDEX stok-ndx IS PRIMARY UNIQUE stok_kod.

DEFINE TEMP-TABLE tt-aylik NO-UNDO
    FIELD sira              AS INTEGER
    FIELD yil               AS INTEGER
    FIELD ay                AS INTEGER
    FIELD ay_bas            AS DATE
    FIELD ay_son            AS DATE
    FIELD ay_etiket         AS CHARACTER FORMAT "x(12)"
    FIELD acilis_ham_stok   AS DECIMAL DECIMALS 2
    FIELD satin_alinan      AS DECIMAL DECIMALS 2
    FIELD geri_donusum      AS DECIMAL DECIMALS 2
    FIELD giren_hammadde    AS DECIMAL DECIMALS 2
    FIELD yari_mamul_stok   AS DECIMAL DECIMALS 2
    FIELD proses_fire       AS DECIMAL DECIMALS 2
    FIELD fire_yuzde        AS DECIMAL DECIMALS 2
    FIELD uretilen_bitmis   AS DECIMAL DECIMALS 2
    FIELD kapanis_ham_stok  AS DECIMAL DECIMALS 2
    FIELD notlar            AS CHARACTER FORMAT "x(60)"
    INDEX sira-ndx IS PRIMARY sira.

DEFINE BUFFER b-stok FOR stok_kart.

FUNCTION ay-etiket-yap RETURNS CHARACTER
  ( INPUT p-yil AS INTEGER, INPUT p-ay AS INTEGER ):
    DEFINE VARIABLE c AS CHARACTER EXTENT 12 INIT [
        "Oca","Sub","Mar","Nis","May","Haz",
        "Tem","Agu","Eyl","Eki","Kas","Ara"] NO-UNDO.
    IF p-ay < 1 OR p-ay > 12 THEN RETURN STRING(p-ay) + "." + STRING(p-yil MOD 100,"99").
    RETURN c[p-ay] + "." + STRING(p-yil MOD 100,"99").
END FUNCTION.

FUNCTION ay-sonu-tarih RETURNS DATE
  ( INPUT p-yil AS INTEGER, INPUT p-ay AS INTEGER ):
    IF p-ay = 12 THEN RETURN DATE(12, 31, p-yil).
    RETURN DATE(p-ay + 1, 1, p-yil) - 1.
END FUNCTION.

FUNCTION ay-ileri RETURNS DATE ( INPUT p-tarih AS DATE ):
    DEFINE VARIABLE v-yil AS INTEGER NO-UNDO.
    DEFINE VARIABLE v-ay  AS INTEGER NO-UNDO.
    v-yil = YEAR(p-tarih).
    v-ay  = MONTH(p-tarih).
    IF v-ay = 12 THEN RETURN DATE(1, 1, v-yil + 1).
    RETURN DATE(v-ay + 1, 1, v-yil).
END FUNCTION.

FUNCTION ham-ad-uygun RETURNS LOGICAL
  ( INPUT p-ad AS CHARACTER ):
    DEFINE VARIABLE v-ad AS CHARACTER NO-UNDO.
    IF p-ad = ? OR TRIM(p-ad) = "" THEN RETURN FALSE.
    v-ad = CAPS(p-ad).
    IF INDEX(v-ad, "HAMMADDE") > 0 THEN RETURN TRUE.
    IF INDEX(v-ad, "MASTERBATCH") > 0 THEN RETURN TRUE.
    IF INDEX(v-ad, "KATK") > 0 THEN RETURN TRUE.
    RETURN FALSE.
END FUNCTION.

FUNCTION hammadde-cache-mi RETURNS LOGICAL ( INPUT p-stok AS CHARACTER ):
    RETURN CAN-FIND(FIRST tt-ham WHERE tt-ham.stok_kod = p-stok).
END FUNCTION.

FUNCTION uretim-kg RETURNS DECIMAL
  ( INPUT p-birim AS CHARACTER, INPUT p-bmiktar AS DECIMAL, INPUT p-dmiktar AS DECIMAL ):
    DEFINE VARIABLE v-birim AS CHARACTER NO-UNDO.
    DEFINE VARIABLE v-kg    AS DECIMAL   NO-UNDO.
    v-birim = IF p-birim = ? THEN "" ELSE CAPS(p-birim).
    IF v-birim = "KG" THEN
        v-kg = p-dmiktar.
    ELSE IF v-birim = "ADET" OR v-birim = "METRE" THEN
        v-kg = p-bmiktar.
    ELSE
        v-kg = 0.
    IF v-kg = ? THEN v-kg = 0.
    RETURN v-kg.
END FUNCTION.

FUNCTION hammadde-mi RETURNS LOGICAL
  ( INPUT p-firma AS CHARACTER, INPUT p-stok AS CHARACTER ):
    FIND FIRST b-stok NO-LOCK
        WHERE b-stok.firma_kod = p-firma
          AND b-stok.stok_kod  = p-stok NO-ERROR.
    RETURN AVAILABLE b-stok AND b-stok.tip_kod = "Hammadde".
END FUNCTION.

FUNCTION hareket-giris-mi RETURNS LOGICAL ( INPUT p-gc AS CHARACTER ):
    RETURN p-gc BEGINS "Gir" OR p-gc BEGINS "GIR".
END FUNCTION.

FUNCTION dec-str RETURNS CHARACTER ( INPUT p-val AS DECIMAL ):
    IF p-val = ? THEN RETURN "".
    RETURN STRING(p-val).
END FUNCTION.

PROCEDURE ham-log:
    DEFINE INPUT PARAMETER p-msg AS CHARACTER NO-UNDO.
    OUTPUT TO VALUE(p-log-dosya) APPEND NO-CONVERT.
    PUT UNFORMATTED STRING(TODAY,"99/99/9999") " " STRING(TIME,"HH:MM:SS") " " p-msg SKIP.
    OUTPUT CLOSE.
END PROCEDURE.

PROCEDURE ham-hammadde-cache-yukle:
    DEFINE VARIABLE v-say AS INTEGER NO-UNDO.
    EMPTY TEMP-TABLE tt-ham.
    FOR EACH stok_kart NO-LOCK
        WHERE stok_kart.firma_kod = p-firma-kod:
        IF NOT ham-ad-uygun(stok_kart.stok_ad) THEN NEXT.
        CREATE tt-ham.
        tt-ham.stok_kod = stok_kart.stok_kod.
        v-say = v-say + 1.
    END.
    RUN ham-log (INPUT "Hammadde/masterbatch/katki kod sayisi: " + STRING(v-say)).
END PROCEDURE.

PROCEDURE ham-aylik-hesap-ay:
    DEFINE INPUT PARAMETER p-yil AS INTEGER NO-UNDO.
    DEFINE INPUT PARAMETER p-ay  AS INTEGER NO-UNDO.

    DEFINE VARIABLE d-bas      AS DATE    NO-UNDO.
    DEFINE VARIABLE d-son      AS DATE    NO-UNDO.
    DEFINE VARIABLE v-ham-stok AS DECIMAL NO-UNDO.
    DEFINE VARIABLE v-alis     AS DECIMAL NO-UNDO.
    DEFINE VARIABLE v-giren    AS DECIMAL NO-UNDO.
    DEFINE VARIABLE v-fire     AS DECIMAL NO-UNDO.
    DEFINE VARIABLE v-uretim   AS DECIMAL NO-UNDO.
    DEFINE VARIABLE v-geri     AS DECIMAL NO-UNDO.
    DEFINE VARIABLE v-etiket   AS CHARACTER NO-UNDO.
    DEFINE VARIABLE v-kg       AS DECIMAL NO-UNDO.

    d-bas = DATE(p-ay, 1, p-yil).
    d-son = ay-sonu-tarih(p-yil, p-ay).
    v-etiket = ay-etiket-yap(p-yil, p-ay).

    RUN ham-log (INPUT "Ay: " + v-etiket).

    IF p-ham-stok-hesap THEN
        RUN ham-stok-bakiye-ay (INPUT d-son, OUTPUT v-ham-stok).

    FOR EACH irsaliye_detay NO-LOCK
        WHERE irsaliye_detay.firma_kod = p-firma-kod
          AND irsaliye_detay.belge_tarih >= d-bas
          AND irsaliye_detay.belge_tarih <= d-son
          AND irsaliye_detay.alis_satis BEGINS "Al":
        IF NOT hammadde-cache-mi(irsaliye_detay.stok_kod) THEN NEXT.
        IF irsaliye_detay.dmiktar <> ? THEN
            v-alis = v-alis + irsaliye_detay.dmiktar.
        ELSE IF irsaliye_detay.bmiktar <> ? THEN
            v-alis = v-alis + irsaliye_detay.bmiktar.
    END.

    FOR EACH stok_hareket NO-LOCK
        WHERE stok_hareket.firma_kod = p-firma-kod
          AND stok_hareket.belge_tarih >= d-bas
          AND stok_hareket.belge_tarih <= d-son
          AND stok_hareket.depo_kod = "21"
          AND stok_hareket.diger_depo = "11"
          AND stok_hareket.hareket_kod = "ST-03":
        IF NOT hammadde-cache-mi(stok_hareket.stok_kod) THEN NEXT.
        v-giren = v-giren + stok_hareket.hareket_miktar.
    END.

    FOR EACH erp_detay2 NO-LOCK
        WHERE erp_detay2.firma_kod = p-firma-kod
          AND erp_detay2.create_date >= d-bas
          AND erp_detay2.create_date <= d-son:
        IF erp_detay2.hurda_miktar > 0 THEN DO:
            v-fire = v-fire + erp_detay2.hurda_miktar.
            NEXT.
        END.
        v-kg = uretim-kg(erp_detay2.birim, erp_detay2.bmiktar, erp_detay2.dmiktar).
        IF v-kg <= 0 THEN NEXT.
        IF CAPS(erp_detay2.parti_kod) BEGINS "G" THEN
            v-geri = v-geri + v-kg.
        ELSE
            v-uretim = v-uretim + v-kg.
    END.

    v-i = v-i + 1.
    CREATE tt-aylik.
    ASSIGN
        tt-aylik.sira             = v-i
        tt-aylik.yil              = p-yil
        tt-aylik.ay               = p-ay
        tt-aylik.ay_bas           = d-bas
        tt-aylik.ay_son           = d-son
        tt-aylik.acilis_ham_stok  = v-ham-stok
        tt-aylik.satin_alinan     = v-alis
        tt-aylik.geri_donusum     = v-geri
        tt-aylik.giren_hammadde   = v-giren
        tt-aylik.yari_mamul_stok  = ?
        tt-aylik.proses_fire      = v-fire
        tt-aylik.fire_yuzde       = ?
        tt-aylik.uretilen_bitmis  = v-uretim
        tt-aylik.kapanis_ham_stok = ?
        tt-aylik.notlar           = "".
    tt-aylik.ay_etiket = v-etiket.
END PROCEDURE.

PROCEDURE ham-stok-bakiye-ay:
    DEFINE INPUT  PARAMETER p-son-tarih AS DATE    NO-UNDO.
    DEFINE OUTPUT PARAMETER p-bakiye    AS DECIMAL NO-UNDO.

    p-bakiye = 0.
    FOR EACH stok_hareket NO-LOCK
        WHERE stok_hareket.firma_kod = p-firma-kod
          AND stok_hareket.belge_tarih <= p-son-tarih:
        IF stok_hareket.hareket_kod = "ST-06"
           OR stok_hareket.hareket_kod = "ST-04" THEN NEXT.
        IF NOT hammadde-cache-mi(stok_hareket.stok_kod) THEN NEXT.
        IF hareket-giris-mi(stok_hareket.giris_cikis) THEN
            p-bakiye = p-bakiye + stok_hareket.hareket_miktar.
        ELSE
            p-bakiye = p-bakiye - stok_hareket.hareket_miktar.
    END.
END PROCEDURE.

PROCEDURE ham-aylik-doldur:
    DEFINE INPUT PARAMETER p-bas AS DATE NO-UNDO.
    DEFINE INPUT PARAMETER p-bit AS DATE NO-UNDO.

    EMPTY TEMP-TABLE tt-aylik.
    v-i = 0.
    v-ay-bas = DATE(MONTH(p-bas), 1, YEAR(p-bas)).

    DO WHILE v-ay-bas <= p-bit:
        RUN ham-aylik-hesap-ay (INPUT YEAR(v-ay-bas), INPUT MONTH(v-ay-bas)).
        v-ay-bas = ay-ileri(v-ay-bas).
    END.

    v-ay-adet = v-i.
END PROCEDURE.

PROCEDURE ham-aylik-csv-yaz:
    DEFINE INPUT PARAMETER p-dosya AS CHARACTER NO-UNDO.

    DEFINE VARIABLE t1 AS DECIMAL NO-UNDO.
    DEFINE VARIABLE t2 AS DECIMAL NO-UNDO.
    DEFINE VARIABLE t4 AS DECIMAL NO-UNDO.
    DEFINE VARIABLE t6 AS DECIMAL NO-UNDO.
    DEFINE VARIABLE t8 AS DECIMAL NO-UNDO.

    FOR EACH tt-aylik:
        t1 = t1 + tt-aylik.acilis_ham_stok.
        t2 = t2 + tt-aylik.satin_alinan.
        t4 = t4 + tt-aylik.giren_hammadde.
        t6 = t6 + tt-aylik.proses_fire.
        t8 = t8 + tt-aylik.uretilen_bitmis.
    END.

    OUTPUT TO VALUE(p-dosya) NO-CONVERT.
    PUT UNFORMATTED
        "Yil-Ay;"
        "Hammadde Stok Kg;"
        "Satin Alinan Kg;"
        "Geridonusum Kg;"
        "Giren Hammadde Kg;"
        "Yari Mamul Stok Kg;"
        "Proses Fire Kg;"
        "Fire %;"
        "Uretilen Bitmis Kg;"
        "Kapanis Hammadde Kg;"
        "Not" SKIP.

    FOR EACH tt-aylik BY tt-aylik.sira:
        PUT UNFORMATTED
            tt-aylik.ay_etiket ";"
            dec-str(tt-aylik.acilis_ham_stok) ";"
            dec-str(tt-aylik.satin_alinan) ";"
            dec-str(tt-aylik.geri_donusum) ";"
            dec-str(tt-aylik.giren_hammadde) ";"
            dec-str(tt-aylik.yari_mamul_stok) ";"
            dec-str(tt-aylik.proses_fire) ";"
            dec-str(tt-aylik.fire_yuzde) ";"
            dec-str(tt-aylik.uretilen_bitmis) ";"
            dec-str(tt-aylik.kapanis_ham_stok) ";"
            tt-aylik.notlar SKIP.
    END.

    PUT UNFORMATTED
        "Toplam;"
        STRING(t1) ";"
        STRING(t2) ";"
        ";" STRING(t4) ";" ";" STRING(t6) ";" ";" STRING(t8) ";" ";" "" SKIP.

    OUTPUT CLOSE.
END PROCEDURE.

PROCEDURE ham-aylik-ozet-acil:
    DEFINE INPUT PARAMETER p-firma   AS CHARACTER NO-UNDO.
    DEFINE INPUT PARAMETER p-bas     AS DATE      NO-UNDO.
    DEFINE INPUT PARAMETER p-bit      AS DATE      NO-UNDO.
    DEFINE INPUT PARAMETER p-mode    AS CHARACTER NO-UNDO.
    DEFINE INPUT PARAMETER p-stok    AS LOGICAL   NO-UNDO.

    ASSIGN
        p-firma-kod      = p-firma
        p-bas-tarih      = p-bas
        p-bit-tarih      = p-bit
        p-export-mode    = p-mode
        p-ham-stok-hesap = p-stok.

    RUN ham-log (INPUT "Basladi. Stok: " + (IF p-ham-stok-hesap THEN "EVET" ELSE "HAYIR")).

    RUN ham-hammadde-cache-yukle.
    RUN ham-aylik-doldur (INPUT p-bas-tarih, INPUT p-bit-tarih).

    IF p-csv-dosya = "" THEN
        p-csv-dosya = "C:\Users\ahmetfaruk.mollaoglu\Desktop\ham-aylik-acil-"
            + STRING(YEAR(p-bas-tarih))
            + STRING(MONTH(p-bas-tarih),"99")
            + "-"
            + STRING(YEAR(p-bit-tarih))
            + STRING(MONTH(p-bit-tarih),"99")
            + ".csv".

    RUN ham-aylik-csv-yaz (INPUT p-csv-dosya).

    RUN ham-log (INPUT "Bitti. CSV: " + p-csv-dosya + " Ay: " + STRING(v-ay-adet)).
    MESSAGE "CSV hazir:" SKIP p-csv-dosya SKIP "Ay:" v-ay-adet SKIP "Log:" p-log-dosya
        VIEW-AS ALERT-BOX INFO BUTTONS OK.
END PROCEDURE.

/* ONCE BUNU CALISTIR - stok kolonu bos, digerleri dolu, hizli */
RUN ham-aylik-ozet-acil (
    INPUT p-firma-kod,
    INPUT p-bas-tarih,
    INPUT p-bit-tarih,
    INPUT p-export-mode,
    INPUT NO).
