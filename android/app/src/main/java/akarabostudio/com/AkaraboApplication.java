package akarabostudio.com;

import android.app.Application;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.media.AudioAttributes;
import android.os.Build;
import android.provider.Settings;

public class AkaraboApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        createNotificationChannel();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;

        NotificationChannel channel = new NotificationChannel(
            getString(R.string.akarabo_notification_channel_id),
            getString(R.string.akarabo_notification_channel_name),
            NotificationManager.IMPORTANCE_HIGH
        );
        channel.setDescription("Time-sensitive booking and client message alerts");
        channel.enableVibration(true);
        channel.setSound(
            Settings.System.DEFAULT_NOTIFICATION_URI,
            new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()
        );

        NotificationManager manager = getSystemService(NotificationManager.class);
        if (manager != null) manager.createNotificationChannel(channel);
    }
}
